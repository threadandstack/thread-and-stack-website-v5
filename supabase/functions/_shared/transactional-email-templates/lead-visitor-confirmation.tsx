import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Thread & Stack'

interface Props {
  name?: string
}

const LeadVisitorConfirmation = ({ name }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Thanks for reaching out to {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={accentBar} />
        <Text style={eyebrow}>Message received</Text>
        <Heading style={h1}>
          {name ? `Thanks, ${name}.` : 'Thanks for reaching out.'}
        </Heading>
        <Text style={text}>
          Your message just landed in my inbox. I read every one personally and
          usually reply within one or two working days — sometimes sooner.
        </Text>
        <Text style={text}>
          In the meantime, if it's useful, you can browse recent thinking on
          narratives, systems, and the <em>creative tax</em> over on the journal.
        </Text>

        <Link href="https://threadandstack.com/journal" style={link}>
          Read the Thread &amp; Stack Journal →
        </Link>

        <Hr style={hr} />

        <Text style={footer}>
          Reply any time — this address goes straight to me.
        </Text>
        <Text style={signature}>— Brendan, {SITE_NAME}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: LeadVisitorConfirmation,
  subject: 'Thanks — your message has landed',
  displayName: 'Lead visitor confirmation',
  previewData: { name: 'Jane' },
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
  fontSize: '32px',
  fontWeight: 600,
  fontStyle: 'italic' as const,
  color: '#0d0d0d',
  lineHeight: 1.15,
  margin: '0 0 20px',
}
const text = {
  fontSize: '15px',
  lineHeight: 1.6,
  color: '#333333',
  margin: '0 0 16px',
}
const link = {
  fontSize: '15px',
  color: '#1340E8',
  fontWeight: 600,
  textDecoration: 'none',
}
const hr = { border: 'none', borderTop: '1px solid #ececec', margin: '28px 0' }
const footer = {
  fontSize: '13px',
  lineHeight: 1.6,
  color: '#666666',
  margin: '0 0 12px',
}
const signature = {
  fontFamily: '"Crimson Pro", Georgia, serif',
  fontSize: '15px',
  fontStyle: 'italic' as const,
  color: '#0d0d0d',
  margin: '16px 0 0',
}
