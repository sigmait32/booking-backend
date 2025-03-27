


// import { sendMail } from '../utiles/nodemailer.js'

// export const sendEmail = async (req, res) => {
//     try {
//         const { email } = req.body;

//         if (!email) {
//             return res.status(400).json({ error: "Email is required" });
//         }

//         const emailResponse = await sendMail({
//             to: email,
//             subject: "Order Expiring Soon",
//             text: "Your order is expiring soon. Please take action.",
//             html: "<h1>Order Expiring Soon</h1><p>Your order is expiring soon. Please take action.</p>",
//         });

//         if (emailResponse.success) {
//             res.status(200).json({ message: "Email sent successfully" });
//         } else {
//             res.status(500).json({ error: "Failed to send email" });
//         }
//     } catch (error) {
//         console.error("Server error:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };


// import { sendMail } from '../utils/nodemailer.js';
import { sendMail } from '../utiles/nodemailer.js'
import fs from 'fs/promises';
import path from 'path';
import handlebars from 'handlebars';

export const sendEmail = async (req, res) => {
    try {
        const { email, name, expiryDate } = req.body;

        if (!email || !name || !expiryDate) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Load and compile the email template
        // const templatePath = path.join(process.cwd(), "emailTemplates", "orderExpiryTemplate.html");
        const templatePath = path.join(process.cwd(), "utiles", "emailTemplates", "orderExpiryTemplate.html");
        const templateFile = await fs.readFile(templatePath, "utf-8");
        const template = handlebars.compile(templateFile);

        // Create dynamic content
        const renewalLink = `https://yourwebsite.com/renew?email=${email}`;
        const htmlContent = template({ name, expiryDate, renewalLink });

        // Send email
        const emailResponse = await sendMail({
            to: email,
            subject: "Order Expiring Soon",
            text: `Dear ${name}, your order is expiring on ${expiryDate}. Renew now: ${renewalLink}`,
            html: htmlContent,
        });

        if (emailResponse.success) {
            res.status(200).json({ message: "Email sent successfully" });
        } else {
            res.status(500).json({ error: "Failed to send email" });
        }
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
