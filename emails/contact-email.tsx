import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export type ContactEmailProps = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const ContactEmail = ({ name, email, subject, message }: ContactEmailProps) => {
  const previewText = `New message from ${name}: ${subject}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>New contact form message</Heading>
          <Text style={subtitle}>
            You received a new message from your portfolio contact form.
          </Text>

          <Hr style={hr} />

          <Section style={row}>
            <Text style={label}>Name</Text>
            <Text style={value}>{name}</Text>
          </Section>
          <Section style={row}>
            <Text style={label}>Email</Text>
            <Text style={value}>{email}</Text>
          </Section>
          <Section style={row}>
            <Text style={label}>Subject</Text>
            <Text style={value}>{subject}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={row}>
            <Text style={label}>Message</Text>
            <Text style={{ ...value, whiteSpace: "pre-wrap" }}>{message}</Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Reply directly to this email to respond to {name}.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ContactEmail;

const main: React.CSSProperties = {
  backgroundColor: "#0b0b0f",
  color: "#e5e7eb",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  padding: "24px 0",
};

const container: React.CSSProperties = {
  backgroundColor: "#131318",
  border: "1px solid #262631",
  borderRadius: "12px",
  margin: "0 auto",
  maxWidth: "560px",
  padding: "32px",
};

const heading: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "20px",
  fontWeight: 700,
  margin: "0 0 4px",
};

const subtitle: React.CSSProperties = {
  color: "#9ca3af",
  fontSize: "14px",
  margin: 0,
};

const row: React.CSSProperties = {
  margin: "0 0 12px",
};

const label: React.CSSProperties = {
  color: "#8b8b96",
  fontSize: "12px",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  margin: "0 0 2px",
};

const value: React.CSSProperties = {
  color: "#f3f4f6",
  fontSize: "15px",
  margin: 0,
};

const hr: React.CSSProperties = {
  border: "none",
  borderTop: "1px solid #262631",
  margin: "20px 0",
};

const footer: React.CSSProperties = {
  color: "#6b7280",
  fontSize: "12px",
  margin: 0,
};
