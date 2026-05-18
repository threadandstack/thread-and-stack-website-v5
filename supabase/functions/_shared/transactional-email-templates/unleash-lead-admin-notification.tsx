import * as React from 'npm:react@18.3.1'
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
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  email?: string
  source?: string
  message?: string
  submittedAt?: string
}

const Row = ({ label, value }: { label: string; value?: string | null }) =>
  value ? (
    <Text style={rowText}>
      <strong style={rowLabel}>{label}:</strong> {value}
    </Text>
  ) : null

const UnleashLeadAdminNotification = ({
  email,
  source,
  message,
  submittedAt,
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New lead from /unleash-your-team</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={accentBar} />
        <Text style={eyebrow}>New lead</Text>
        <Heading style={h1}>Unleash Your Team — resources unlocked</Heading>
        <Text style={text}>Someone just joined the list to access the AI starter pack.</Text>

        <Hr style={hr} />
        <Row label="Email" value={email} />
        <Row label="Source" value={source} />
        <Row label="Message" value={message} />
        <Row label="Submitted" value={submittedAt} />
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: UnleashLeadAdminNotification,
  subject: 'New lead — Unleash Your Team',
  displayName: 'Unleash lead admin notification',
  to: 'br@brendanrodgers.uk',
  previewData: {
    email: 'jane@example.org',
    source: 'unleash-your-team-resources',
    message: 'Unlocked AI starter pack resources',
    submittedAt: new Date().toISOString(),
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", Arial, sans-serif',
  color: '#0d0d0d',
}
const container = { padding: '32px 28px', maxWidth: '560px' }
const accentBar = {
  height: '4px',
  width: '48px',
  backgroundColor: '#1340E8',
  borderRadius: '2px',
  margin: '0 0 24px',
}
const eyebrow = {
  fontSize: '11px',
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  color: '#1340E8',
  fontWeight: 600,
  margin: '0 0 12px',
}
const h1 = {
  fontFamily: '"Crimson Pro", Georgia, serif',
  fontSize: '24px',
  fontWeight: 600,
  fontStyle: 'italic' as const,
  color: '#0d0d0d',
  lineHeight: 1.2,
  margin: '0 0 16px',
}
const text = { fontSize: '15px', lineHeight: 1.6, color: '#333333', margin: '0 0 16px' }
const hr = { border: 'none', borderTop: '1px solid #ececec', margin: '20px 0' }
const rowText = { fontSize: '14px', lineHeight: 1.6, color: '#333333', margin: '0 0 6px' }
const rowLabel = { color: '#0d0d0d' }
