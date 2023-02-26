import nodemailer, { TransportOptions } from "nodemailer";
import { IsEmailOptions } from "validator/lib/isEmail";


export interface MailInterface {
   
    from?: string;
    to: string | string[];
    subject: string;
    text?: string;
}

export interface Options{
    email:string,
    subject:string,
    message?:string,
}

const sendEmail =async (options:Options) => {
   

    //1. Create a Transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
       
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    } as TransportOptions);

    //2. define the email options

    const mailOptions:MailInterface = {
        from: "Amrit Ghimire <foodDElivery@123.io",
        to: options.email ,
        subject: options.subject,
        text: options.message,
    };

    //3. Actually send the email
    await transporter.sendMail(mailOptions)
};

export default sendEmail;