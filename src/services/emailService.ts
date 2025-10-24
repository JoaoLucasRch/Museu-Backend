import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_MUSEUM,
    pass: process.env.EMAIL_PASS,
  },
});

export class EmailService {
  static async sendResetPasswordEmail(
    to: string, 
    userName: string, 
    resetToken: string
  ) {
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_MUSEUM,
      to: to,
      subject: 'Redefinição de Senha - Museu Virtual',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Redefinição de Senha</h2>
          <p>Olá, <strong>${userName}</strong>!</p>
          <p>Recebemos uma solicitação para redefinir sua senha.</p>
          <p>Clique no link abaixo para criar uma nova senha:</p>
          <a href="${resetLink}" 
             style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
            Redefinir Senha
          </a>
          <p>Se você não solicitou esta redefinição, ignore este email.</p>
          <p><small>Este link expira em 1 hora.</small></p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Equipe Museu Virtual
          </p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Email de redefinição enviado para:', to);
      return true;
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return false;
    }
  }
}