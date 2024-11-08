// Main Mail file with all configurabled data
const nodemailer = require('nodemailer');
var Hogan = require('hogan.js');
var fs = require('fs');
var path = require('path').resolve('./'); //get main dir path

// Async function to get the Test List
exports.sendEmail = async function (to, name, subject, temFile, text) {
	try {
		// for given dynamic template files and compile it.
		var rtemplate = fs.readFileSync('./templates/'+temFile, 'utf-8');
		var compiledTemplate = Hogan.compile(rtemplate);
		
		let transport = nodemailer.createTransport({
		    host: 'smtp.gmail.com',
		    port: 587,
		    auth: {
		       user: 'priyankastrivedge@gmail.com',
		       pass: 'gbvjzxunuhwwqadp'
		    }
		});

		// console.log("transport ",transport)
		const mailOptions = {
		  from: `(Meeto noreplymeeto@gmail.com)`,
		  to: `(${name} ${to})`,
		  subject: subject,
		  html: compiledTemplate.render({text}),
		};

	// 	console.log("mailOptions ",mailOptions)

		transport.sendMail(mailOptions, function(error, info) {
		  if (error) {
		    console.log(error);
		  } else {
		    console.log('Email sent: ' + info.response);
		  }
		});
		
	} catch (e) {
        console.log("e ",e)
        console.log("\n\nMail update Issaues >>>>>>>>>>>>>>\n\n");
    }
}