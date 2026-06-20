import { transporter } from "./transport.js";

export const sendEmail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: `"${process.env.APP_NAME || "MyApp"}" <${process.env.EMAIL_USER}>`,

    to,
    subject,
    html,
  });
};
