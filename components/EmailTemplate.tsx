// /components/EmailTemplate.tsx
interface EmailTemplateProps {
  subject: string;
  text: string;
}

export const renderEmailTemplate = ({ subject, text }: EmailTemplateProps): string => {
    return `
      <div style="background-color: #f7fafc; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <div style="background-color: #CBDCE0; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 32px; font-weight: bold; margin: 0;">${subject}</h1>
          </div>
          <div style="padding: 30px;">
            <p style="color: #4a5568; font-size: 18px; line-height: 1.6; margin-bottom: 20px;">${text}</p>
            <div style="text-align: center; margin-top: 40px;">
              <a href="https://budgetcanvas.com" target="_blank" style="display: inline-block; background-color: #CBDCE0; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; padding: 12px 30px; border-radius: 5px;">Visit Budget Canvas</a>
            </div>
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #CBDCE0">
              <p style="color: #718096; font-size: 14px; line-height: 1.5; margin: 0;">Thank you for using Budget Canvas! If you have any questions or need assistance, feel free to reach out to us.</p>
              <p style="color: #718096; font-size: 14px; line-height: 1.5; margin-top: 10px;">Best regards,<br>The Budget Canvas Team</p>
            </div>
          </div>
        </div>
      </div>
    `;
  };