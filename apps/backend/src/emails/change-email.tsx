/** @jsxImportSource react */
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ChangeEmailProps {
  userEmail: string;
  newEmail: string;
  verificationUrl: string;
}

export const ChangeEmailTemplate = ({
  userEmail,
  newEmail,
  verificationUrl,
}: ChangeEmailProps) => (
  <Html>
    <Head />
    <Preview>Approve email change</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Approve email change</Heading>
        <Text style={text}>
          Hi there! We received a request to change your email address from {userEmail} to {newEmail}.
        </Text>
        <Text style={text}>
          To approve this change, please click the button below:
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={verificationUrl}>
            Approve Email Change
          </Button>
        </Section>
        <Text style={text}>
          If the button doesn't work, you can also click this link:
        </Text>
        <Link href={verificationUrl} style={link}>
          {verificationUrl}
        </Link>
        <Text style={footer}>
          If you didn't request this change, please ignore this email and contact support.
        </Text>
      </Container>
    </Body>
  </Html>
);

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
  textAlign: 'center' as const,
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 8px 8px 8px',
  textAlign: 'left' as const,
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const link = {
  color: '#3b82f6',
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
  margin: '16px 8px',
  display: 'block',
};

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '32px 8px 0 8px',
  textAlign: 'left' as const,
};