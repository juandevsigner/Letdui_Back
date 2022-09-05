import { text } from "express";
import nodemailer from "nodemailer";

export const emailRegister = async data => {
  const { email, name, token } = data;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //MAIL INFORMATION
  const info = await transport.sendMail({
    from: '"LetDui - Admin" <letdui@admin.com>',
    to: email,
    subject: "Letdui App - Confirm Your Account",
    text: "Confirm your account and admin your projects",
    html: `<p>Hi! ${name} pls confirm your account</p>
    <p>You need confirm your account, click on next link</p>
    <a href="${process.env.FRONTEND_URL}/confirm/${token}">Confirm Account</a>
    `,
  });
};

export const emailRecoverPass = async data => {
  const { email, name, token } = data;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //MAIL INFORMATION
  const info = await transport.sendMail({
    from: '"LetDui - Admin" <letdui@admin.com>',
    to: email,
    subject: "Letdui App - Change Your Password",
    text: "Change Your Password",
    html: `<p>Hi! ${name} change your password on the next link</p>
    <a href="${process.env.FRONTEND_URL}/recover-pass/${token}">Change Password</a>
    `,
  });
};
