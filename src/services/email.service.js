// services/email.service.js
const nodemailer = require("nodemailer")
const { EMAIl_HOST, EMAIL_PASS, FRONTEND_URL, EMAIL_USER } = require('../config/environment');
const logger = require("../utils/logger");

class EmailService {
    static getTransporter() {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS
            }
        });
    }

    static async sendPasswordResetEmail(email, resetToken) {
        const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
        
        const mailOptions = {
            from: EMAIl_HOST,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p>You requested to reset your password. Click the button below to proceed:</p>
                    <a href="${resetUrl}" 
                       style="display: inline-block; padding: 12px 24px; background-color: #007bff; 
                              color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
                        Reset Password
                    </a>
                    <p style="color: #666; font-size: 14px;">
                        This link will expire in 1 hour.
                    </p>
                    <p style="color: #666; font-size: 14px;">
                        If you didn't request this, please ignore this email.
                    </p>
                </div>
            `
        };

        try {
            const transporter = this.getTransporter();
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent:', info.messageId);
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    static async sendRegistrationVerificationEmail(email,token){
        try {
            const verificationUrl = `${FRONTEND_URL}/email-verification?emailVerificationToken=${token}`
            const mailOptions = {
                from : EMAIl_HOST,
                to : email,
                subject : "Verification of Email for Registration completion",
                html : `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Email Verification Request</h2>
                    <p>You are requested to verify your account. Click the button below to proceed:</p>
                    <a href="${verificationUrl}" 
                       style="display: inline-block; padding: 12px 24px; background-color: #007bff; 
                              color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
                        Verify Email
                    </a>
                    <p style="color: #666; font-size: 14px;">
                        This link will expire in 7 Days.
                    </p>
                    <p style="color: #666; font-size: 14px;">
                        If you didn't request this, please ignore this email.
                    </p>
                </div>
                `
            }
            const transporter = this.getTransporter()
            await transporter.sendMail(mailOptions)
            console.log("Email Verification Sucessfully send")
        } catch (error) {
            logger.error(`There was an error while sending resgistration email - ${JSON.stringify(error)}`,error)
            throw error
        }
    }
}

module.exports = EmailService;