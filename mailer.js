const nodemailer = require("nodemailer");
require('dotenv').config()
const {
    getAuthToken,
    getSpreadSheet,
    getSpreadSheetValues,
    updateValues
} = require('./googleSheetService.js');

// dotenv.config();

const spreadsheetId = process.env.SPREADSHEETID;
const sheetName = process.env.SHEETNAME;

async function getSheetData() {
    const authToken = await getAuthToken();
    const sheetData = await getSpreadSheetValues({
        spreadsheetId,
        auth: authToken,
        sheetName
    });
    // console.log('output for getSpreadSheetValues', JSON.stringify(response.data));
    // console.log('output for getSpreadSheetValues', sheetData.data.values);
    return sheetData.data.values;
}

function formatSheetData(sheetData) {
    const formattedData = sheetData.map((data) => {
        if(data[1] == 'Email address')
        {
            return;
        }

        if(data[5] == '0')
        {
            return;
        }

        return {
            name: data[6],
            email: data[1],
            eno: data[2],
            cburl: data[13],
            cbmail: data[4]
        }
    });
    return formattedData;
}

const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.PORT,
    secure: false,
    auth: {
        user: process.env.USERMAIL,
        pass: process.env.PASS
    }
})

async function main() {
    // const info = await transporter.sendMail({
    //     from: '"Google Developer Student Club | Jawaharlal Nehru University" <gdsc.jnu@gmail.com>',
    //     to: "tusharc.cse@gmail.com, work.alamsahil@gmail.com",
    //     subject: "Hello",
    //     text: "Hello world",
    //     html: "<b>Hello world</b>"
    // });

    // console.log("Message sent: %s", info.messageId);

    sheetData = await getSheetData();
    sheetData = formatSheetData(sheetData);

    sheetData.forEach(async (data) => {
        if(data == undefined)
        {
            return;
        }
        const info = await transporter.sendMail({
            from: '"Google Developer Student Club | Jawaharlal Nehru University" <gdsc.jnu@gmail.com>',
            to: data.email,
            subject: "GDSC JNU | Registration acknowledgement for Generative AI study jam",
            text: `Hello ${data.name}, \n\nThank you for registering for the Generative AI study jam. We are excited to have you on board. \n\nYour registration details are as follows: \n\nName: ${data.name} \nEmail: ${data.email} \nEnrollment Number: ${data.eno} \nCloudSkillBoostMail: ${data.cbmail} \nCloud Skill Boost account: ${data.cburl} \n\nYou can join the Whatsapp Group using the following link: https://chat.whatsapp.com/Lg5fXK66T10DxVFwDcY1TR \n\nWe look forward to seeing you at the study jam. \n\nBest, \nTushar Choudhary \nLead \nGoogle Developer Student Club \nJawaharlal Nehru University`,
            html:`<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">

            <div class="container" style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; background-color: #f9f9f9;">
                <img src="https://res.cloudinary.com/dmznzo1ya/image/upload/v1714245863/armpwnlgzn3atuqkds6p.png" alt="Google Developer Student Club" style="display: block; margin: 0 auto 20px; max-width: 100%; height: auto;">
            
                <p>Hello ${data.name},</p>
            
                <p>Thank you for registering for the Generative AI study jam. We are excited to have you on board.</p>
            
                <p>Your registration details are as follows:</p>
            
                <ul style="list-style-type: none; padding: 0;">
                    <li><strong>Name:</strong> ${data.name}</li>
                    <li><strong>Email:</strong> ${data.email}</li>
                    <li><strong>Enrollment Number:</strong> ${data.eno}</li>
                    <li><strong>Cloud Skill Boost Mail:</strong> ${data.cbmail}</li>
                    <li><strong>Cloud Skill Boost account:</strong> ${data.cburl}</li>
                </ul>
            
                <p>You can join the WhatsApp Group using the following link: <a href="https://chat.whatsapp.com/Lg5fXK66T10DxVFwDcY1TR" style="text-decoration: none; color: #007bff;">Join WhatsApp Group</a></p>
            
                <p>We look forward to seeing you at the study jam.</p>
            
                <p>Best,</p>
                <p style="font-weight: bold;">Tushar Choudhary</p>
                <p>Lead</p>
                <p>Google Developer Student Club</p>
                <p>Jawaharlal Nehru University</p>
            </div>
            
            </body>`
        })

        console.log("Message sent to %s: %s", data.email, info.messageId);
    })
}

// async function test() {
//     sheetData = await getSheetData();
//     sheetData = formatSheetData(sheetData);
//     console.log(sheetData);
// }

// test().catch(console.error);

main().catch(console.error);