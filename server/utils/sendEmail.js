const sdMail = require("@sendgrid/mail");

sdMail.setApiKey(
  "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"
);
// sdMail.setApiKey(process.env.EM_API);

const msg = {
  // from: 'hasanalan567@gmail.com',
  from: {
    name: "Boilerplate Code",
    email: "hasanalan567@gmail.com",
  },
  to: `allanhasanbaiz@gmail.com`,
  subject: `title`,
  text: `this is discription`,
  html: `<h1>this is html </h1>`,
};

sdMail
  .send(msg)
  .then((res) => console.log("Email send successfully"))
  .catch((err) => console.log(`Email Not Send. err is:${err}`));
