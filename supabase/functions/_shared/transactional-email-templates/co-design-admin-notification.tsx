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
  name?: string
  email?: string
  roleOrg?: string
  focus?: string
  amountPaid?: number // pence
  variant?: string
  source?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  environment?: string
  stripeSessionId?: string
}

const Row = ({ label, value }: { label: string; value?: string | null }) =>
  value ? (
    <Text style={rowText}>
      <strong style={rowLabel}>{label}:</strong> {value}
    </Text>
  ) : null

const variantLabel = (v?: string) =>
  v === 'co-design-six' ? 'Co-Design series (6 sessions)' : 'Co-Design Session (1 session)'

const CoDesignAdminNotification = ({
  name,
  email,
  roleOrg,
  focus,
  amountPaid,
  variant,
  source,
  utmSource,
  utmMedium,
  utmCampaign,
  environment,
  stripeSessionId,
}: Props) => {
  const amountStr =
    typeof amountPaid === 'number' ? `£${(amountPaid / 100).toFixed(2)}` : 'unknown'
  const vLabel = variantLabel(variant)

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>
        New Co-Design booking — {name || 'unknown'} ({amountStr})
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={accentBar} />
          <Text style={eyebrow}>New booking · {vLabel}</Text>
          <Heading style={h1}>
            {name || 'New customer'} just booked.
          </Heading>
          <Text style={leadText}>
            {amountStr} paid{environment ? ` · ${environment}` : ''}
          </Text>

          <Hr style={hr} />

          <Heading as="h2" style={h2}>
            Customer
          </Heading>
          <Row label="Name" value={name} />
          <Row label="Email" value={email} />
          <Row label="Role / Org" value={roleOrg} />

          {focus ? (
            <>
              <Heading as="h2" style={h2}>
                What they want to work on
              </Heading>
              <Text style={focusText}>{focus}</Text>
            </>
          ) : null}

          <Hr style={hr} />

          <Heading as="h2" style={h2}>
            Attribution
          </Heading>
          <Row label="Source" value={source} />
          <Row label="UTM Source" value={utmSource} />
          <Row label="UTM Medium" value={utmMedium} />
          <Row label="UTM Campaign" value={utmCampaign} />

          <Hr style={hr} />

          <Heading as="h2" style={h2}>
            Payment
          </Heading>
          <Row label="Package" value={vLabel} />
          <Row label="Amount" value={amountStr} />
          <Row label="Stripe session" value={stripeSessionId} />
          <Row label="Environment" value={environment} />

          <Text style={footer}>
            Reply within 24 hours with calendar options and the prep prompt.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: CoDesignAdminNotification,
  subject: (data: Record<string, any>) =>
    `New ${variantLabel(data.variant)} booking — ${data.name || 'unknown'}`,
  to: 'br@brendanrodgers.uk',
  displayName: 'Co-Design admin notification',
  previewData: {
    name: 'Jane Doe',
    email: 'jane@example.com',
    roleOrg: 'Founder, Acme Studio',
    focus: 'We keep re-writing the same product story with every campaign.',
    amountPaid: 250000,
    variant: 'co-design-six',
    source: 'co-design',
    environment: 'live',
    stripeSessionId: 'cs_live_abc123',
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", Arial, sans-serif',
  color: '#0d0d0d',
}
const container = { padding: '32px 28px', maxWidth: '600px' }
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
  fontSize: '26px',
  fontWeight: 600,
  fontStyle: 'italic' as const,
  color: '#0d0d0d',
  lineHeight: 1.2,
  margin: '0 0 8px',
}
const h2 = {
  fontFamily: '"Crimson Pro", Georgia, serif',
  fontSize: '17px',
  fontWeight: 600,
  fontStyle: 'italic' as const,
  color: '#0d0d0d',
  margin: '0 0 10px',
}
const leadText = {
  fontSize: '14px',
  color: '#1340E8',
  fontWeight: 500,
  margin: '0',
}
const rowText = {
  fontSize: '14px',
  lineHeight: 1.5,
  color: '#333333',
  margin: '0 0 6px',
}
const rowLabel = { color: '#666666', fontWeight: 600 }
const focusText = {
  fontSize: '14px',
  lineHeight: 1.6,
  color: '#333333',
  backgroundColor: '#f7f8fc',
  borderLeft: '3px solid #1340E8',
  padding: '12px 14px',
  margin: '0 0 12px',
  borderRadius: '4px',
}
const hr = {
  border: 'none',
  borderTop: '1px solid #ececec',
  margin: '24px 0',
}
const footer = {
  fontSize: '13px',
  color: '#666666',
  margin: '20px 0 0',
}
