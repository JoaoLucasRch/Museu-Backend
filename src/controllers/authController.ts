import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { EmailService } from '../services/emailService';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

//Body para registro
export interface RegisterBody {
  nome: string;
  email: string;
  senha: string;
  contato: string;
  role?: 'ARTISTA' | 'ADMIN';
}

//Body para login
export interface LoginBody {
  email: string;
  senha: string;
}

//Body para esqueci senha
export interface ForgotPasswordBody {
  email: string;
}

//Body para redefinir senha
export interface ResetPasswordBody {
  token: string;
  novaSenha: string;
}

//Cadastro de usuário
export async function register(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { nome, email, senha, contato, role } = request.body;

  try {
    if (!isValidEmail(email)) {
      return reply.status(400).send({ message: 'Formato de email inválido.' });
    }

    if (!nome || !email || !senha || !contato) {
      return reply.status(400).send({ message: 'Todos os campos são obrigatórios.' });
    }

    // Validação de senha (mínimo 8 caracteres)
    if (senha.length < 8) {
      return reply.status(400).send({ message: 'A senha deve ter pelo menos 8 caracteres.' });
    }

    if (role === 'ADMIN') {
      if (!request.user || request.user.role !== 'ADMIN') {
        return reply
          .status(403)
          .send({ message: 'Apenas administradores podem criar outro administrador.' });
      }
    }

    //Hash de senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    const user = await prisma.usuario.create({
      data: {
        nome,
        email: email.toLowerCase(),
        senha: hashedPassword,
        contato,
        role: role || 'ARTISTA',
      },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
      },
    });

    return reply.status(201).send(user);
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target.includes('email')) {
      return reply.status(409).send({ message: 'Email já cadastrado.' });
    }
    console.error('Erro no registro:', error);
    return reply.status(500).send({ message: 'Erro interno ao registrar usuário.' });
  }
}

//Login
export async function login(
  request: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply
) {
  const { email, senha } = request.body;

  try {
    if (!email || !senha) {
      return reply.status(400).send({ message: 'Email e senha são obrigatórios.' });
    }

    if (!isValidEmail(email)) {
      return reply.status(400).send({ message: 'Formato de email inválido.' });
    }

    const user = await prisma.usuario.findUnique({ 
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return reply.status(401).send({ message: 'Email ou senha incorretos.' });
    }

    const passwordMatch = await bcrypt.compare(senha, user.senha);
    if (!passwordMatch) {
      return reply.status(401).send({ message: 'Email ou senha incorretos.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '2h' }
    );

    return reply.send({ token });
  } catch (error) {
    console.error('Erro no login:', error);
    return reply.status(500).send({ message: 'Erro interno ao fazer login.' });
  }
}

//Login via Google OAuth
export async function loginGoogle(
  request: FastifyRequest<{ Body: { token: string } }>,
  reply: FastifyReply
) {
  const { token } = request.body;

  try {
    if (!token) {
      return reply.status(400).send({ message: 'Token do Google é obrigatório.' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.name) {
      return reply.status(400).send({ message: 'Token Google inválido.' });
    }

    const email = payload.email.toLowerCase();

    let user = await prisma.usuario.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.usuario.create({
        data: {
          nome: payload.name,
          email,
          senha: '',
          contato: '',
          foto: payload.picture || null,
          role: 'ARTISTA',
        },
      });
    }

    // Gera JWT interno
    const appToken = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '8h' }
    );

    return reply.send({
      token: appToken,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        foto: user.foto,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Erro no login com Google:', error);
    return reply.status(500).send({ message: 'Erro ao autenticar com o Google.' });
  }
}

//Esqueci minha senha
export async function forgotPassword(
  request: FastifyRequest<{ Body: ForgotPasswordBody }>,
  reply: FastifyReply
) {
  const { email } = request.body;

  try {
    if (!email || !isValidEmail(email)) {
      return reply.status(400).send({ message: 'Email inválido.' });
    }

    const user = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return reply.send({ 
        message: 'Se o email estiver cadastrado, enviaremos instruções para redefinição.' 
      });
    }

    //Verifica se é usuário Google
    if (user.senha === '') {
      return reply.status(400).send({ 
        message: 'Esta conta foi criada via Google. Use o login social.' 
      });
    }

    //Gera token de redefinição
    const resetToken = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        type: 'password_reset'
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    const emailSent = await EmailService.sendResetPasswordEmail(
      user.email,
      user.nome,
      resetToken
    );

    if (!emailSent) {
      return reply.status(500).send({ 
        message: 'Erro ao enviar email. Tente novamente.' 
      });
    }

    return reply.send({ 
      message: 'Se o email estiver cadastrado, enviaremos instruções para redefinição.' 
    });

  } catch (error) {
    console.error('Erro no esqueci senha:', error);
    return reply.status(500).send({ message: 'Erro interno ao processar solicitação.' });
  }
}

//Redefine a senha
export async function resetPassword(
  request: FastifyRequest<{ Body: ResetPasswordBody }>,
  reply: FastifyReply
) {
  const { token, novaSenha } = request.body;

  try {
    if (!token || !novaSenha) {
      return reply.status(400).send({ message: 'Token e nova senha são obrigatórios.' });
    }

    if (novaSenha.length < 8) {
      return reply.status(400).send({ message: 'A senha deve ter pelo menos 8 caracteres.' });
    }

    //Verifica token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      email: string;
      type: string;
      exp: number;
    };

    if (decoded.type !== 'password_reset') {
      return reply.status(400).send({ message: 'Token inválido.' });
    }

    const user = await prisma.usuario.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return reply.status(400).send({ message: 'Token inválido ou expirado.' });
    }

    const hashedPassword = await bcrypt.hash(novaSenha, 10);

      const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {

    throw new Error('Variável de ambiente JWT_SECRET não está definida.'); 
  }

  const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    //Atualiza senha
    await prisma.usuario.update({
      where: { id: user.id },
      data: { senha: hashedPassword }
    });

    return reply.send({ 
      message: 'Senha redefinida com sucesso.' 
    });

  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return reply.status(400).send({ message: 'Token expirado. Solicite uma nova redefinição.' });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return reply.status(400).send({ message: 'Token inválido.' });
    }

    console.error('Erro ao redefinir senha:', error);
    return reply.status(500).send({ message: 'Erro interno ao redefinir senha.' });
  }
}
