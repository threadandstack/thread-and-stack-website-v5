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

const SITE_NAME = 'Thread & Stack'

interface Props {
  name?: string
  amountPaid?: number // pence
  couponCode?: string
}

const PowerHourBuyerConfirmation = ({ name, amountPaid, couponCode }: Props) => {
  const firstName = name ? name.split(' ')[0] : null
  const amountStr =
    typeof amountPaid === 'number' ? `£${(amountPaid / 100).toFixed(0)}` : null

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Your Stack Diagnostic is booked — next steps inside</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={accentBar} />
          <Text style={eyebrow}>Booking confirmed</Text>
          <Heading style={h1}>
            {firstName ? `Thank you, ${firstName}.` : 'Thank you.'}
          </Heading>
          <Text style={text}>
            Your Stack Diagnostic is booked
            {amountStr ? ` — ${amountStr} confirmed` : ''}
            {couponCode ? ` (voucher ${couponCode} applied)` : ''}.
          </Text>
          <Text style={text}>
            I'll be in touch within 24 hours from{' '}
            <strong>br@brendanrodgers.uk</strong> with a few calendar options and a
            short prep prompt so we hit the ground running.
          </Text>

          <Hr style={hr} />

          <Heading as="h2" style={h2}>
            Before we meet
          </Heading>
          <Text style={text}>
            Have a think about <strong>one workflow</strong> that's eating your team's
            time — the messier the better. We'll spend the hour getting it running
            with AI, properly.
          </Text>
          <Text style={textSmall}>
            Bring: a rough description of the workflow, who does it today, and what
            "good" looks like. No prep deck required.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            If anything looks off — wrong amount, wrong details, or you didn't mean
            to book — just reply to this email or drop me a line at
            br@brendanrodgers.uk and I'll sort it straight away.
          </Text>
          <Text style={signature}>— Brendan, {SITE_NAME}</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: PowerHourBuyerConfirmation,
  subject: 'Your AI Power-Hour is booked',
  displayName: 'Power-Hour buyer confirmation',
  previewData: { name: 'Jane Doe', amountPaid: 29500, couponCode: 'CHARITYMEETUP100' },
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
const h2 = {
  fontFamily: '"Crimson Pro", Georgia, serif',
  fontSize: '20px',
  fontWeight: 600,
  fontStyle: 'italic' as const,
  color: '#0d0d0d',
  margin: '0 0 12px',
}
const text = {
  fontSize: '15px',
  lineHeight: 1.6,
  color: '#333333',
  margin: '0 0 16px',
}
const textSmall = {
  fontSize: '13px',
  lineHeight: 1.6,
  color: '#666666',
  margin: '0 0 16px',
}
const hr = {
  border: 'none',
  borderTop: '1px solid #ececec',
  margin: '28px 0',
}
const footer = {
  fontSize: '13px',
  lineHeight: 1.6,
  color: '#666666',
  margin: '0 0 16px',
}
const signature = {
  fontFamily: '"Crimson Pro", Georgia, serif',
  fontSize: '15px',
  fontStyle: 'italic' as const,
  color: '#0d0d0d',
  margin: '20px 0 0',
}
