/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as powerHourBuyerConfirmation } from './power-hour-buyer-confirmation.tsx'
import { template as powerHourAdminNotification } from './power-hour-admin-notification.tsx'
import { template as unleashResourcesConfirmation } from './unleash-resources-confirmation.tsx'
import { template as unleashLeadAdminNotification } from './unleash-lead-admin-notification.tsx'
import { template as leadVisitorConfirmation } from './lead-visitor-confirmation.tsx'
import { template as leadAdminNotification } from './lead-admin-notification.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'power-hour-buyer-confirmation': powerHourBuyerConfirmation,
  'power-hour-admin-notification': powerHourAdminNotification,
  'unleash-resources-confirmation': unleashResourcesConfirmation,
  'unleash-lead-admin-notification': unleashLeadAdminNotification,
  'lead-visitor-confirmation': leadVisitorConfirmation,
  'lead-admin-notification': leadAdminNotification,
}
