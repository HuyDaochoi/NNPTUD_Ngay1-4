// utils/mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "fe28e68bf2d4da",
    pass: "349cf4ccaddb9f"
  }
});

const sendPasswordMail = async (toEmail, password) => {
  await transporter.sendMail({
    from: '"Admin" <no-reply@test.com>',
    to: toEmail,
    subject: "Account created",
    html: `<p>Your account has been created</p>
           <p>Password: <b>${password}</b></p>`
  });
};

module.exports = { sendPasswordMail };