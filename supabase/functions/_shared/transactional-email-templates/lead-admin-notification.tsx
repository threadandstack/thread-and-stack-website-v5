import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface ScorecardAnswer {
  dimension?: string
  score?: number
  answer?: string
}

interface Props {
  name?: string
  email?: string
  source?: string
  message?: string
  submittedAt?: string
  firstName?: string
  lastName?: string
  jobRole?: string
  companyName?: string
  companyWebsite?: string
  annualRevenue?: string
  employees?: string
  // Scorecard extras
  scorecardScore?: number
  scorecardLevel?: string
  scorecardRecommend?: string
  scorecardAnswers?: ScorecardAnswer[]
  type?: string
}

const LEVEL_COLOR: Record<string, string> = {
  Fragmented: '#c94a3a',
  Patchworked: '#d98634',
  Consolidating: '#1340E8',
  Compounding: '#0a8f57',
}

const formatDate = (iso?: string) => {
  if (!iso) return null
  try {
    const d = new Date(iso)
    return d.toLocaleString('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Europe/London',
    })
  } catch {
    return iso
  }
}

const InfoRow = ({ label, value }: { label: string; value?: string | null }) =>
  value ? (
    <Row style={infoRowStyle}>
      <Column style={infoLabelCol}>
        <Text style={infoLabel}>{label}</Text>
      </Column>
      <Column>
        <Text style={infoValue}>{value}</Text>
      </Column>
    </Row>
  ) : null

const LeadAdminNotification = ({
  name,
  email,
  source,
  message,
  submittedAt,
  firstName,
  jobRole,
  companyName,
  companyWebsite,
  annualRevenue,
  employees,
  scorecardScore,
  scorecardLevel,
  scorecardRecommend,
  scorecardAnswers,
  type,
}: Props) => {
  const isScorecard = type === 'scorecard-explore' || typeof scorecardScore === 'number'
  const levelColor = scorecardLevel ? LEVEL_COLOR[scorecardLevel] ?? '#1340E8' : '#1340E8'
  const submitted = formatDate(submittedAt)
  const previewText = isScorecard
    ? `Scorecard ${scorecardScore ?? '?'} / 24 — ${scorecardLevel ?? 'result'} · ${name ?? 'new lead'}`
    : `New lead${name ? ` from ${name}` : ''} · ${source || 'website'}`

  const replyHref = email
    ? `mailto:${email}${name ? `?subject=${encodeURIComponent('Re: your enquiry')}` : ''}`
    : null
  const websiteHref = companyWebsite
    ? companyWebsite.startsWith('http')
      ? companyWebsite
      : `https://${companyWebsite}`
    : null

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={accentBar} />
          <Text style={eyebrow}>
            {isScorecard ? 'Scorecard enquiry' : 'New lead'}
          </Text>
          <Heading style={h1}>
            {name ? `${name} just got in touch` : 'A new lead just came in'}
          </Heading>
          <Text style={subtext}>
            via <strong style={{ color: '#0d0d0d' }}>{source || 'website'}</strong>
            {submitted ? ` · ${submitted}` : ''}
          </Text>

          {/* Primary actions */}
          {(replyHref || websiteHref) && (
            <Section style={{ margin: '20px 0 8px' }}>
              <Row>
                {replyHref && (
                  <Column style={{ paddingRight: '8px' }}>
                    <Button href={replyHref} style={primaryBtn}>
                      Reply to {firstName || name || 'them'}
                    </Button>
                  </Column>
                )}
                {websiteHref && (
                  <Column>
                    <Button href={websiteHref} style={secondaryBtn}>
                      Visit site ↗
                    </Button>
                  </Column>
                )}
              </Row>
            </Section>
          )}

          {/* Scorecard result card */}
          {isScorecard && (
            <Section
              style={{
                ...card,
                borderColor: levelColor,
                backgroundColor: `${levelColor}0d`,
              }}
            >
              <Text style={cardEyebrow}>Their result</Text>
              <Row>
                <Column style={{ width: '110px' }}>
                  <Text
                    style={{
                      ...scoreNumber,
                      color: levelColor,
                    }}
                  >
                    {scorecardScore}
                    <span style={scoreDenom}> / 24</span>
                  </Text>
                </Column>
                <Column>
                  {scorecardLevel && (
                    <Text
                      style={{
                        ...levelPill,
                        color: levelColor,
                        borderColor: levelColor,
                      }}
                    >
                      {scorecardLevel}
                    </Text>
                  )}
                  {scorecardRecommend && (
                    <Text style={recommendText}>
                      Suggested: <strong>{scorecardRecommend}</strong>
                    </Text>
                  )}
                </Column>
              </Row>

              {Array.isArray(scorecardAnswers) && scorecardAnswers.length > 0 && (
                <>
                  <Hr style={hrLight} />
                  <Text style={cardEyebrow}>All 8 answers</Text>
                  {scorecardAnswers.map((a, i) => {
                    const s = typeof a.score === 'number' ? a.score : 0
                    const barColor =
                      s >= 3 ? '#0a8f57' : s === 2 ? '#1340E8' : s === 1 ? '#d98634' : '#c94a3a'
                    return (
                      <Row key={i} style={answerRow}>
                        <Column style={{ width: '18px', verticalAlign: 'top' }}>
                          <Text style={answerIndex}>{i + 1}.</Text>
                        </Column>
                        <Column>
                          <Text style={answerDim}>
                            {a.dimension}
                            <span
                              style={{
                                ...answerScoreTag,
                                color: barColor,
                                borderColor: barColor,
                              }}
                            >
                              {s}/3
                            </span>
                          </Text>
                          <Text style={answerLabel}>{a.answer}</Text>
                        </Column>
                      </Row>
                    )
                  })}
                </>
              )}
            </Section>
          )}

          {/* Contact details card */}
          <Section style={card}>
            <Text style={cardEyebrow}>Contact</Text>
            <InfoRow label="Name" value={name} />
            <InfoRow
              label="Email"
              value={
                email
                  ? // Rendered as link for click-to-copy in most clients
                    (email as unknown as string)
                  : undefined
              }
            />
            <InfoRow label="Role" value={jobRole} />
            <InfoRow label="Company" value={companyName} />
            <InfoRow label="Website" value={companyWebsite} />
            <InfoRow label="Revenue" value={annualRevenue} />
            <InfoRow label="Employees" value={employees} />
            <InfoRow label="Source" value={source} />
            <InfoRow label="Submitted" value={submitted ?? undefined} />
          </Section>

          {/* Raw message — only show if not a pure scorecard (which duplicates it) */}
          {message && !isScorecard && (
            <Section style={card}>
              <Text style={cardEyebrow}>Message</Text>
              <Text style={messageText}>{message}</Text>
            </Section>
          )}

          <Hr style={hr} />
          <Text style={footnote}>
            Sent automatically from threadandstack.com when a lead is captured.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: LeadAdminNotification,
  subject: (data: Record<string, any>) => {
    if (typeof data?.scorecardScore === 'number') {
      return `Scorecard ${data.scorecardScore}/24 — ${data?.scorecardLevel ?? ''}${data?.name ? ` · ${data.name}` : ''}`.trim()
    }
    return `New lead — ${data?.source || 'website'}${data?.name ? ` (${data.name})` : ''}`
  },
  displayName: 'Lead admin notification',
  to: 'br@brendanrodgers.uk',
  previewData: {
    name: 'Jane Example',
    email: 'jane@example.org',
    source: 'scorecard-results',
    submittedAt: new Date().toISOString(),
    firstName: 'Jane',
    jobRole: 'Head of Ops',
    companyName: 'Example Studio',
    companyWebsite: 'https://example.org',
    annualRevenue: '£500k – £1M',
    employees: '11 – 25',
    type: 'scorecard-explore',
    scorecardScore: 13,
    scorecardLevel: 'Patchworked',
    scorecardRecommend: 'Knowledge Base Starter',
    scorecardAnswers: [
      { dimension: 'Tool sprawl', score: 1, answer: '7–10 — sprawl is real' },
      { dimension: 'Single source of truth', score: 2, answer: 'Two or three places' },
      { dimension: 'Duplicate answers', score: 1, answer: 'Weekly' },
      { dimension: 'Knowledge continuity', score: 2, answer: 'Most of it — handover fills gaps' },
      { dimension: 'AI grounding', score: 1, answer: 'Mostly generic ChatGPT / Claude tabs' },
      { dimension: 'Automation', score: 2, answer: 'A handful of Zaps or Makes' },
      { dimension: 'Founder bottleneck', score: 2, answer: 'Sometimes, on the edges' },
      { dimension: 'Onboarding speed', score: 2, answer: 'A week or two' },
    ],
    message: 'Full report attached below.',
  },
} satisfies TemplateEntry

/* Styles */
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
  margin: '0 0 20px',
}
const eyebrow = {
  fontSize: '11px',
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  color: '#1340E8',
  fontWeight: 700,
  margin: '0 0 10px',
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
const subtext = {
  fontSize: '13px',
  lineHeight: 1.5,
  color: '#666666',
  margin: '0 0 4px',
}

const primaryBtn = {
  backgroundColor: '#1340E8',
  color: '#ffffff',
  padding: '10px 16px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 600,
  textDecoration: 'none',
  display: 'inline-block',
}
const secondaryBtn = {
  backgroundColor: '#ffffff',
  color: '#0d0d0d',
  border: '1px solid #d9d9d9',
  padding: '10px 16px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 600,
  textDecoration: 'none',
  display: 'inline-block',
}

const card = {
  border: '1px solid #ececec',
  borderRadius: '12px',
  padding: '18px 20px',
  margin: '18px 0 0',
}
const cardEyebrow = {
  fontSize: '10.5px',
  letterSpacing: '0.16em',
  textTransform: 'uppercase' as const,
  color: '#6b6b6b',
  fontWeight: 600,
  margin: '0 0 12px',
}

const infoRowStyle = { marginBottom: '2px' }
const infoLabelCol = { width: '120px', verticalAlign: 'top' as const }
const infoLabel = {
  fontSize: '13px',
  color: '#6b6b6b',
  margin: '0 0 6px',
  lineHeight: 1.5,
}
const infoValue = {
  fontSize: '14px',
  color: '#0d0d0d',
  fontWeight: 500,
  margin: '0 0 6px',
  lineHeight: 1.5,
  wordBreak: 'break-word' as const,
}

const scoreNumber = {
  fontFamily: '"Crimson Pro", Georgia, serif',
  fontSize: '54px',
  lineHeight: 1,
  margin: '4px 0 0',
  fontWeight: 600,
}
const scoreDenom = { fontSize: '18px', color: '#6b6b6b', fontWeight: 400 }
const levelPill = {
  display: 'inline-block',
  border: '1px solid',
  borderRadius: '999px',
  padding: '4px 10px',
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '0.02em',
  margin: '6px 0 8px',
}
const recommendText = {
  fontSize: '13px',
  color: '#333333',
  margin: '4px 0 0',
  lineHeight: 1.5,
}

const answerRow = { marginBottom: '10px' }
const answerIndex = {
  fontSize: '12px',
  color: '#6b6b6b',
  margin: '0',
  lineHeight: 1.5,
}
const answerDim = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#0d0d0d',
  margin: '0 0 2px',
  lineHeight: 1.4,
}
const answerScoreTag = {
  display: 'inline-block',
  border: '1px solid',
  borderRadius: '999px',
  padding: '1px 7px',
  fontSize: '10.5px',
  marginLeft: '8px',
  fontWeight: 600,
  verticalAlign: 'middle' as const,
}
const answerLabel = {
  fontSize: '13px',
  color: '#4a4a4a',
  margin: '0',
  lineHeight: 1.5,
}

const hr = { border: 'none', borderTop: '1px solid #ececec', margin: '24px 0 12px' }
const hrLight = { border: 'none', borderTop: '1px solid #ececec', margin: '16px 0' }
const messageText = {
  fontSize: '13px',
  lineHeight: 1.6,
  color: '#333333',
  whiteSpace: 'pre-wrap' as const,
  margin: '0',
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
}
const footnote = {
  fontSize: '11px',
  color: '#9a9a9a',
  margin: '0',
  textAlign: 'center' as const,
}
