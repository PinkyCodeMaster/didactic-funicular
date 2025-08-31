import { Resend } from 'resend';
import { render } from '@react-email/render';
import { EmailVerificationTemplate } from '../../emails/verification-email.js';
import { PasswordResetTemplate } from '../../emails/password-reset.js';
import { ChangeEmailTemplate } from '../../emails/change-email.js';
import env from '@repo/env';
const resend = new Resend(env.RESEND_API_KEY);
const isDevelopment = process.env.NODE_ENV === 'development';
async function sendEmail({ to, subject, html }) {
    if (isDevelopment) {
        console.log('\n=== EMAIL (Development Mode) ===');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`HTML Content:\n${html}`);
        console.log('=== END EMAIL ===\n');
        return { success: true, messageId: 'dev-mode' };
    }
    try {
        const { data, error } = await resend.emails.send({
            from: 'noreply@wolfpackdefence.co.uk',
            to,
            subject,
            html,
        });
        if (error) {
            console.error('Email sending error:', error);
            return { success: false, error };
        }
        console.log('Email sent successfully:', data);
        return { success: true, data };
    }
    catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, error };
    }
}
export async function sendVerificationEmail({ to, verificationUrl }) {
    const html = await render(EmailVerificationTemplate({
        userEmail: to,
        verificationUrl,
    }));
    return sendEmail({
        to,
        subject: 'Verify your email address',
        html,
    });
}
export async function sendPasswordResetEmail({ to, resetUrl }) {
    const html = await render(PasswordResetTemplate({
        userEmail: to,
        resetUrl,
    }));
    return sendEmail({
        to,
        subject: 'Reset your password',
        html,
    });
}
export async function sendChangeEmailVerification({ to, newEmail, verificationUrl }) {
    const html = await render(ChangeEmailTemplate({
        userEmail: to,
        newEmail,
        verificationUrl,
    }));
    return sendEmail({
        to,
        subject: 'Approve email change',
        html,
    });
}
