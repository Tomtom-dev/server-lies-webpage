const express = require("express");
const nodemailer = require("nodemailer");
const multiparty = require("multiparty");

require("dotenv").config();

const port = process.env.port || 5000;

// initiat express app

const app= express();


const transporter = nodemailer.createTransport({
    host: "smtp.google.com", //replace with your email provider
    port: 587,
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
});

// verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });


// verify connection configuration

app.post("/send", (req, res) => {
    //1.
    let form = new multiparty.Form();
    let data = {};
    form.parse(req, function (err, fields) {
        console.log(fields);
        Object.keys(fields).forEach(function (property) {
            data[property] = fields[property].toString();
        });
        
        //2. You can configure the object however you want
        const mail = {
            from: data.name,
            to: process.env.E_MAIL,
            subject: data.subject,
            text: `${data.name} <${data.email}> \n${data.message}`,
        };
        
        //3.
        transporter.sendMail(mail, (err, data) => {
            if (err) {
                console.log(err);
                res.status(500).send("Something went wrong.");
            } else {
                res.status(200).send("Email successfully sent to recipient!");
            }
        });
    });
});


app.route("/").get(function (req, res){
    res.sendFile(process.cwd() + "/public/index.html")
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
