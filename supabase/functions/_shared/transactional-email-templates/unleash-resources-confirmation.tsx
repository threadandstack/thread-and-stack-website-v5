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

const RESOURCES = [
  {
    title: 'AI Training Resources',
    description:
      'A curated Notion hub of AI training links for purpose-driven teams: courses, primers, and trusted starting points.',
    url: 'https://threadandstack.notion.site/AI-Resources-for-Nonprofits-3518863b87d4802c98f0eed5afc6ecea',
  },
  {
    title: 'Quick Wins With AI',
    description:
      'Small, immediate AI moves your team can apply this week — drafting, summarising, reclaiming time from admin chaos.',
    url: 'https://threadandstack.notion.site/Quick-Wins-With-AI-3518863b87d480f9aaa8def89f7f1726',
  },
  {
    title: 'Prompts & Skills for AI',
    description:
      'Prompt and workflow templates for mission-led teams across fundraising, comms, and operations.',
    url: 'https://threadandstack.notion.site/Prompts-Skills-for-AI-3518863b87d480659135cc9c9f508008',
  },
]

const UnleashResourcesConfirmation = () => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your AI starter pack for purpose-driven teams</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={accentBar} />
        <Text style={eyebrow}>Resources unlocked</Text>
        <Heading style={h1}>Your AI starter pack.</Heading>
        <Text style={text}>
          Thanks for joining the list. Here are the three resources to help your
          team start reclaiming time from the <em>creative tax</em> — all in one
          place so they live in your inbox, not just a browser tab.
        </Text>

        <Hr style={hr} />

        {RESOURCES.map((r) => (
          <Section key={r.url} style={{ margin: '0 0 20px' }}>
            <Heading as="h2" style={h2}>
              {r.title}
            </Heading>
            <Text style={text}>{r.description}</Text>
            <Link href={r.url} style={link}>
              Open the resource →
            </Link>
          </Section>
        ))}

        <Hr style={hr} />

        <Heading as="h2" style={h2}>
          Want hands-on support?
        </Heading>
        <Text style={text}>
          Purpose-driven teams get 15% off an AI Power-Hour with voucher{' '}
          <strong>IMPACT15</strong>. One hour, one workflow — we'll get it
          running with AI properly.
        </Text>
        <Link
          href="https://threadandstack.com/unleash-your-team?book=1"
          style={link}
        >
          Claim your slot →
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
  component: UnleashResourcesConfirmation,
  subject: 'Your AI starter pack — three resources inside',
  displayName: 'Unleash resources confirmation',
  previewData: {},
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
  margin: '0 0 8px',
}
const text = {
  fontSize: '15px',
  lineHeight: 1.6,
  color: '#333333',
  margin: '0 0 12px',
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
  margin: '0 0 16px',
}
const signature = {
  fontFamily: '"Crimson Pro", Georgia, serif',
  fontSize: '15px',
  fontStyle: 'italic' as const,
  color: '#0d0d0d',
  margin: '20px 0 0',
}
