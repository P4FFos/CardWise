const nodemailer = require('nodemailer')


class NodeMailer {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'cardwiseauto@gmail.com',
                pass: 'lepi sqzl qsbp txwi'
            } 
        })
    }

    async sendEmail(to, subject, text) {
        const mailOptions = {
            from: 'cardwiseauto@gmail.com',
            to,
            subject,
            text
        }

        try {
            const info = await this.transporter.sendMail(mailOptions)
            console.log('Email sent: ' + info.response)
        } catch (error) {
            console.error('Error sending email: ', error)
        }
    }

    
}

module.exports = NodeMailer