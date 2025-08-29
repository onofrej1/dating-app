import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export async function sendEmail(
  to: string,
  subject: string,
  message: string
) {
  const mailOptions: Mail.Options = {
    from: process.env.FROM_EMAIL!,
    to,
    subject,
    text: message,
  };

  const sendMailPromise = () =>
    new Promise<string>((resolve, reject) => {
      getTransport().sendMail(mailOptions, function (err) {
        if (!err) {
          resolve("Email sent");
        } else {
          reject(err.message);
        }
      });
    });

  try {
    await sendMailPromise();
    return "success";
  } catch {
    return "error";
  }
}

export function getTransport() {
  const transport = nodemailer.createTransport({
    service: "gmail",
    /* 
          setting service as 'gmail' is same as providing these setings:
          host: "smtp.gmail.com",
          port: 465,
          secure: true
          If you want to use a different email provider other than gmail, you need to provide these manually.
          Or you can go use these well known services and their settings at
          https://github.com/nodemailer/nodemailer/blob/master/lib/well-known/services.json
      */
    auth: {
      user: process.env.SMTP_SERVER_USERNAME,
      pass: process.env.SMTP_SERVER_PASSWORD,
    },
  });
  return transport;
}
