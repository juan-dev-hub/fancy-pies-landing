import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Send a notification email when a new contact message is received
 */
export async function sendContactNotification(
  data: ContactFormData
): Promise<SendEmailResult> {
  const emailTo = process.env.EMAIL_TO || 'contacto@fancypies.com';
  const emailFrom = process.env.EMAIL_FROM || 'Fancy Pies <noreply@fancypies.com>';

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: emailFrom,
      to: [emailTo],
      subject: `🥿 Nuevo mensaje de ${data.name} - Fancy Pies`,
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nuevo mensaje de contacto</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #4CAF50 0%, #81C784 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">👟 Fancy Pies</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Nuevo mensaje de contacto</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
              <div style="background-color: #E8F5E9; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h2 style="color: #2E7D32; margin: 0 0 15px 0; font-size: 18px;">📝 Datos del contacto</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 600; width: 100px;">Nombre:</td>
                    <td style="padding: 8px 0; color: #333;">${escapeHtml(data.name)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 600;">Email:</td>
                    <td style="padding: 8px 0;">
                      <a href="mailto:${escapeHtml(data.email)}" style="color: #4CAF50; text-decoration: none;">${escapeHtml(data.email)}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 600;">Fecha:</td>
                    <td style="padding: 8px 0; color: #333;">${new Date().toLocaleString('es-MX', { 
                      timeZone: 'America/Mexico_City',
                      dateStyle: 'full',
                      timeStyle: 'short'
                    })}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background-color: #fafafa; border-left: 4px solid #4CAF50; padding: 20px; border-radius: 0 12px 12px 0;">
                <h3 style="color: #333; margin: 0 0 10px 0; font-size: 16px;">💬 Mensaje:</h3>
                <p style="color: #555; margin: 0; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
              </div>
              
              <!-- Action Button -->
              <div style="text-align: center; margin-top: 30px;">
                <a href="mailto:${escapeHtml(data.email)}?subject=Re: Tu mensaje a Fancy Pies&body=Hola ${escapeHtml(data.name)},%0D%0A%0D%0AGracias por contactarnos.%0D%0A%0D%0A" 
                   style="display: inline-block; background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%); color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; box-shadow: 0 4px 15px rgba(76,175,80,0.3);">
                  📧 Responder a ${escapeHtml(data.name)}
                </a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #888; margin: 0; font-size: 14px;">
                Este mensaje fue enviado desde el formulario de contacto de <strong>Fancy Pies</strong>
              </p>
              <p style="color: #aaa; margin: 10px 0 0 0; font-size: 12px;">
                Pulga 59, Local 23 • Mercado de Pulgas, Zona Centro
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      // Also send a text version for email clients that don't support HTML
      text: `
👟 NUEVO MENSAJE DE CONTACTO - FANCY PIES

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 DATOS DEL CONTACTO:

Nombre: ${data.name}
Email: ${data.email}
Fecha: ${new Date().toLocaleString('es-MX')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💬 MENSAJE:

${data.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Responde directamente a: ${data.email}

---
Fancy Pies
Pulga 59, Local 23
Mercado de Pulgas, Zona Centro
      `.trim(),
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Email sent successfully:', emailData?.id);
    return { success: true, id: emailData?.id };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Send a confirmation email to the user who submitted the form
 */
export async function sendConfirmationEmail(
  data: ContactFormData
): Promise<SendEmailResult> {
  const emailFrom = process.env.EMAIL_FROM || 'Fancy Pies <noreply@fancypies.com>';

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: emailFrom,
      to: [data.email],
      subject: '✅ Recibimos tu mensaje - Fancy Pies',
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmación de mensaje</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #4CAF50 0%, #81C784 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">👟 Fancy Pies</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">¡Gracias por contactarnos!</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
              <div style="text-align: center; margin-bottom: 25px;">
                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #4CAF50 0%, #81C784 100%); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                  <span style="font-size: 30px;">✅</span>
                </div>
              </div>
              
              <h2 style="color: #333; text-align: center; margin: 0 0 15px 0;">¡Mensaje Recibido!</h2>
              
              <p style="color: #666; text-align: center; line-height: 1.6; margin: 0 0 25px 0;">
                Hola <strong>${escapeHtml(data.name)}</strong>,<br>
                Hemos recibido tu mensaje y te responderemos lo antes posible.
              </p>
              
              <div style="background-color: #E8F5E9; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #2E7D32; margin: 0 0 10px 0; font-size: 14px;">📝 Tu mensaje:</h3>
                <p style="color: #555; margin: 0; line-height: 1.6; font-style: italic;">"${escapeHtml(data.message)}"</p>
              </div>
              
              <div style="background-color: #fafafa; border-radius: 12px; padding: 20px; text-align: center;">
                <p style="color: #888; margin: 0 0 15px 0; font-size: 14px;">
                  ¿Tienes una urgencia? ¡Contáctanos directamente!
                </p>
                <a href="https://wa.me/525512345678" style="display: inline-block; background: #25D366; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                  💬 WhatsApp
                </a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #888; margin: 0; font-size: 14px;">
                <strong>Fancy Pies</strong> - Tu zapatería de confianza
              </p>
              <p style="color: #aaa; margin: 10px 0 0 0; font-size: 12px;">
                Pulga 59, Local 23 • Mercado de Pulgas, Zona Centro
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
✅ RECIBIMOS TU MENSAJE - FANCY PIES

Hola ${data.name},

¡Gracias por contactarnos! Hemos recibido tu mensaje y te responderemos lo antes posible.

📝 Tu mensaje:
"${data.message}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Urgencia? Contáctanos por WhatsApp:
https://wa.me/525512345678

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fancy Pies
Pulga 59, Local 23
Mercado de Pulgas, Zona Centro
      `.trim(),
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Confirmation email sent:', emailData?.id);
    return { success: true, id: emailData?.id };
  } catch (error) {
    console.error('Error sending confirmation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Escape HTML to prevent XSS attacks
 */
function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}
