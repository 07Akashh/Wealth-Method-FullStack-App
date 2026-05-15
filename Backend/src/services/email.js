const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const config = require("../config").cfg;
const appUtils = require("../utils/appUtils");

const readHTMLFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: "utf-8" }, (err, html) => {
      if (err) reject(err);
      else resolve(html);
    });
  });
};

/**
 * Send email using configured SMTP or provided overrides
 * @param {Object} payload { to, subject, template, data, service, user, pass, fromEmail, attachment }
 */
const sendMail = (payload) => {
  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: {
      user: payload?.user || config.smtp.user,
      pass: payload?.pass || config.smtp.pass,
    },
  });

  const fromEmail = payload?.fromEmail || config.smtp.from;
  const templatePath = path.join(__dirname, "emailTemplate", payload.template);

  return readHTMLFile(templatePath)
    .then((html) => {
      const template = handlebars.compile(html);
      const htmlToSend = template(payload.data || {});

      const mailOptions = {
        from: fromEmail,
        to: payload.to,
        subject: payload.subject,
        html: htmlToSend,
        attachments: payload.attachment || [],
      };

      return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            appUtils.logError({ moduleName: "EmailService", methodName: "sendMail", err });
            reject(err);
          } else {
            console.log(`[EMAIL] Sent to ${payload.to}: ${info.response}`);
            resolve(info.response);
          }
        });
      });
    })
    .catch((err) => {
      appUtils.logError({ moduleName: "EmailService", methodName: "sendMail", err });
      throw err;
    });
};

module.exports = { sendMail };
