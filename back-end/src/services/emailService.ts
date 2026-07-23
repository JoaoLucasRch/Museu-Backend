import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_MUSEUM,
    pass: process.env.EMAIL_PASS,
  },
});

export class EmailService {
  // ==================== REDEFINIÇÃO DE SENHA ====================
  static async sendResetPasswordEmail(
    to: string,
    userName: string,
    resetToken: string
  ) {
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_MUSEUM,
      to: to,
      subject: "Redefinição de Senha - Museu Virtual",
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
      console.log("✅ Email de redefinição enviado para:", to);
      return true;
    } catch (error) {
      console.error("❌ Erro ao enviar email:", error);
      return false;
    }
  }

  // ==================== NOTIFICAÇÃO DE STATUS DA OBRA ====================
  static async notificarStatusObra(
    email: string,
    nomeArtista: string,
    tituloObra: string,
    status: string,
    parecer?: string
  ): Promise<boolean> {
    const statusMap = {
      aprovada: {
        subject: '🎉 Sua obra foi aprovada!',
        emoji: '🎉',
        cor: '#059669',
        mensagem: 'Parabéns! Sua obra foi aprovada e agora faz parte do nosso acervo.',
        detalhes: 'A obra será exposta em breve no museu.',
      },
      rejeitada: {
        subject: '📝 Sua obra foi rejeitada',
        emoji: '📝',
        cor: '#dc2626',
        mensagem: 'Infelizmente sua obra não foi aprovada desta vez.',
        detalhes: 'Não desanime! Continue criando e participando de novos editais.',
      },
      exposta: {
        subject: '🖼️ Sua obra está em exposição!',
        emoji: '🖼️',
        cor: '#7c3aed',
        mensagem: 'Sua obra está oficialmente em exposição no museu!',
        detalhes: 'Visite o museu para ver sua obra exposta.',
      },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap];

    if (!statusInfo) {
      console.error(`Status desconhecido: ${status}`);
      return false;
    }

    const tituloFormatado = tituloObra.length > 50 
      ? tituloObra.substring(0, 50) + '...' 
      : tituloObra;

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              background-color: #f9fafb;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 16px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
              padding: 32px 40px;
              text-align: center;
            }
            .header h1 {
              color: #ffffff;
              font-size: 24px;
              font-weight: 700;
              margin: 0;
            }
            .header .emoji {
              font-size: 48px;
              display: block;
              margin-bottom: 8px;
            }
            .body {
              padding: 40px;
            }
            .status-badge {
              display: inline-block;
              padding: 8px 24px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #ffffff;
              background-color: ${statusInfo.cor};
              margin-bottom: 16px;
            }
            .titulo-obra {
              font-size: 20px;
              font-weight: 700;
              color: #111827;
              margin: 8px 0 16px 0;
            }
            .mensagem {
              font-size: 16px;
              color: #374151;
              line-height: 1.6;
              margin: 16px 0;
            }
            .detalhes {
              background-color: #f3f4f6;
              border-radius: 8px;
              padding: 16px 20px;
              font-size: 14px;
              color: #4b5563;
              margin: 16px 0 24px 0;
            }
            .detalhes strong {
              color: #111827;
            }
            .btn {
              display: inline-block;
              padding: 12px 32px;
              background-color: #000000;
              color: #ffffff;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 14px;
              transition: background-color 0.2s;
            }
            .btn:hover {
              background-color: #1a1a1a;
            }
            .footer {
              text-align: center;
              padding: 24px 40px;
              border-top: 1px solid #e5e7eb;
              font-size: 12px;
              color: #9ca3af;
            }
            .footer a {
              color: #6b7280;
              text-decoration: none;
            }
            .footer a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <span class="emoji">${statusInfo.emoji}</span>
              <h1>Atualização da sua obra</h1>
            </div>
            
            <div class="body">
              <div style="text-align: center;">
                <span class="status-badge">${status.toUpperCase()}</span>
              </div>
              
              <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px 0;">Olá, <strong>${nomeArtista}</strong>!</p>
              
              <p class="titulo-obra">"${tituloFormatado}"</p>
              
              <p class="mensagem">${statusInfo.mensagem}</p>
              
              <div class="detalhes">
                <p style="margin: 0;">
                  <strong>Status:</strong> ${status.toUpperCase()}<br>
                  <strong>Obra:</strong> ${tituloFormatado}<br>
                  ${parecer ? `<strong>Parecer:</strong> ${parecer}<br>` : ''}
                  <strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
              
              <p style="text-align: center; margin: 24px 0 0 0;">
                <a href="${frontendUrl}/dashboard" class="btn">
                  Ver minhas obras
                </a>
              </p>
            </div>
            
            <div class="footer">
              <p style="margin: 0;">
                Este é um email automático do <strong>Museu</strong>.<br>
                Caso não tenha solicitado essa notificação, ignore este email.
              </p>
              <p style="margin: 8px 0 0 0;">
                <a href="${frontendUrl}">${frontendUrl}</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_MUSEUM,
      to: email,
      subject: statusInfo.subject,
      html,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Notificação de status enviada para ${email}`);
      return true;
    } catch (error) {
      console.error('Erro ao enviar notificação de status:', error);
      return false;
    }
  }

  // ==================== NOTIFICAÇÃO DE NOVA SUBMISSÃO (PARA ADMIN) ====================
  static async notificarNovaSubmissao(
    adminEmail: string,
    nomeArtista: string,
    tituloObra: string,
    idObra: number,
    editalNome?: string
  ): Promise<boolean> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              background-color: #f9fafb;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 16px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #fbbf24, #f59e0b);
              padding: 32px 40px;
              text-align: center;
            }
            .header h1 {
              color: #ffffff;
              font-size: 24px;
              font-weight: 700;
              margin: 0;
            }
            .header .emoji {
              font-size: 48px;
              display: block;
              margin-bottom: 8px;
            }
            .body {
              padding: 40px;
            }
            .titulo-obra {
              font-size: 20px;
              font-weight: 700;
              color: #111827;
              margin: 8px 0 16px 0;
            }
            .btn {
              display: inline-block;
              padding: 12px 32px;
              background-color: #000000;
              color: #ffffff;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 14px;
            }
            .btn:hover {
              background-color: #1a1a1a;
            }
            .footer {
              text-align: center;
              padding: 24px 40px;
              border-top: 1px solid #e5e7eb;
              font-size: 12px;
              color: #9ca3af;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <span class="emoji">📩</span>
              <h1>Nova submissão recebida!</h1>
            </div>
            
            <div class="body">
              <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px 0;">Olá, Administrador!</p>
              
              <p class="titulo-obra">"${tituloObra}"</p>
              
              <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                O artista <strong>${nomeArtista}</strong> submeteu uma nova obra para avaliação.
              </p>
              
              <div style="background-color: #f3f4f6; border-radius: 8px; padding: 16px 20px; margin: 16px 0 24px 0; font-size: 14px; color: #4b5563;">
                <p style="margin: 0;">
                  <strong>Artista:</strong> ${nomeArtista}<br>
                  <strong>Obra:</strong> ${tituloObra}<br>
                  <strong>ID:</strong> #${idObra}<br>
                  ${editalNome ? `<strong>Edital:</strong> ${editalNome}<br>` : ''}
                </p>
              </div>
              
              <p style="text-align: center; margin: 24px 0 0 0;">
                <a href="${frontendUrl}/admin/dashboard" class="btn">
                  Avaliar obra
                </a>
              </p>
            </div>
            
            <div class="footer">
              <p style="margin: 0;">
                Este é um email automático do <strong>Museu</strong>.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_MUSEUM,
      to: adminEmail,
      subject: 'Nova obra submetida para avaliação',
      html,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Notificação enviada para administrador ${adminEmail}`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao notificar administrador:', error);
      return false;
    }
  }
}