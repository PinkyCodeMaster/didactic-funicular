import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** @jsxImportSource react */
import { Body, Button, Container, Head, Heading, Html, Link, Preview, Section, Text, } from '@react-email/components';
import * as React from 'react';
export const PasswordResetTemplate = ({ userEmail, resetUrl, }) => (_jsxs(Html, { children: [_jsx(Head, {}), _jsx(Preview, { children: "Reset your password" }), _jsx(Body, { style: main, children: _jsxs(Container, { style: container, children: [_jsx(Heading, { style: h1, children: "Reset your password" }), _jsxs(Text, { style: text, children: ["Hi there! We received a request to reset the password for your account (", userEmail, ")."] }), _jsx(Section, { style: buttonContainer, children: _jsx(Button, { style: button, href: resetUrl, children: "Reset Password" }) }), _jsx(Text, { style: text, children: "If the button doesn't work, you can also click this link:" }), _jsx(Link, { href: resetUrl, style: link, children: resetUrl }), _jsx(Text, { style: footer, children: "If you didn't request a password reset, you can safely ignore this email. This link will expire in 1 hour." })] }) })] }));
// Styles
const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};
const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
};
const h1 = {
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '40px 0',
    padding: '0',
    textAlign: 'center',
};
const text = {
    color: '#333',
    fontSize: '16px',
    lineHeight: '26px',
    margin: '16px 8px 8px 8px',
    textAlign: 'left',
};
const buttonContainer = {
    textAlign: 'center',
    margin: '32px 0',
};
const button = {
    backgroundColor: '#3b82f6',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'inline-block',
    padding: '12px 24px',
};
const link = {
    color: '#3b82f6',
    fontSize: '14px',
    textDecoration: 'underline',
    wordBreak: 'break-all',
    margin: '16px 8px',
    display: 'block',
};
const footer = {
    color: '#8898aa',
    fontSize: '14px',
    lineHeight: '22px',
    margin: '32px 8px 0 8px',
    textAlign: 'left',
};
