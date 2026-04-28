export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blog_content_cache: {
        Row: {
          created_at: string
          description: string | null
          header_image_url: string | null
          html_content: string
          id: string
          notion_id: string
          reading_time: string | null
          slug: string
          synced_at: string
          theme: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          header_image_url?: string | null
          html_content: string
          id?: string
          notion_id: string
          reading_time?: string | null
          slug: string
          synced_at?: string
          theme?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          header_image_url?: string | null
          html_content?: string
          id?: string
          notion_id?: string
          reading_time?: string | null
          slug?: string
          synced_at?: string
          theme?: string | null
          title?: string
        }
        Relationships: []
      }
      blog_posts_cache: {
        Row: {
          created_at: string
          description: string | null
          featured: boolean | null
          header_image_url: string | null
          id: string
          intro: string | null
          notion_id: string
          published_date: string | null
          reading_time: string | null
          slug: string
          synced_at: string
          theme: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          featured?: boolean | null
          header_image_url?: string | null
          id?: string
          intro?: string | null
          notion_id: string
          published_date?: string | null
          reading_time?: string | null
          slug: string
          synced_at?: string
          theme?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          featured?: boolean | null
          header_image_url?: string | null
          id?: string
          intro?: string | null
          notion_id?: string
          published_date?: string | null
          reading_time?: string | null
          slug?: string
          synced_at?: string
          theme?: string | null
          title?: string
        }
        Relationships: []
      }
      fiction_favorites: {
        Row: {
          answer: string
          city: string | null
          cluster_key: string | null
          country: string | null
          created_at: string
          device_type: string | null
          emojis: string | null
          enriched_answer: string | null
          genre: string | null
          id: string
          is_repeat_visitor: boolean | null
          timezone: string | null
          user_agent: string | null
        }
        Insert: {
          answer: string
          city?: string | null
          cluster_key?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          emojis?: string | null
          enriched_answer?: string | null
          genre?: string | null
          id?: string
          is_repeat_visitor?: boolean | null
          timezone?: string | null
          user_agent?: string | null
        }
        Update: {
          answer?: string
          city?: string | null
          cluster_key?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          emojis?: string | null
          enriched_answer?: string | null
          genre?: string | null
          id?: string
          is_repeat_visitor?: boolean | null
          timezone?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      hackathon_leads: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string
          want_community: boolean
          want_future_templates: boolean
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source?: string
          want_community?: boolean
          want_future_templates?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string
          want_community?: boolean
          want_future_templates?: boolean
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string | null
          name: string | null
          source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name?: string | null
          source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string | null
          source?: string | null
        }
        Relationships: []
      }
      masterclass_registrations: {
        Row: {
          consent_given: boolean
          created_at: string
          email: string
          id: string
          message: string | null
          mode: string
          name: string
          role_org: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          consent_given?: boolean
          created_at?: string
          email: string
          id?: string
          message?: string | null
          mode?: string
          name: string
          role_org?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          consent_given?: boolean
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          mode?: string
          name?: string
          role_org?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      page_seo: {
        Row: {
          canonical_url: string | null
          created_at: string | null
          featured_related_blog_slug: string | null
          id: string
          keywords: string[] | null
          meta_description: string | null
          no_follow: boolean | null
          no_index: boolean | null
          og_description: string | null
          og_image_path: string | null
          og_title: string | null
          page_path: string
          page_title: string | null
          twitter_description: string | null
          twitter_image_path: string | null
          twitter_title: string | null
          updated_at: string | null
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string | null
          featured_related_blog_slug?: string | null
          id?: string
          keywords?: string[] | null
          meta_description?: string | null
          no_follow?: boolean | null
          no_index?: boolean | null
          og_description?: string | null
          og_image_path?: string | null
          og_title?: string | null
          page_path: string
          page_title?: string | null
          twitter_description?: string | null
          twitter_image_path?: string | null
          twitter_title?: string | null
          updated_at?: string | null
        }
        Update: {
          canonical_url?: string | null
          created_at?: string | null
          featured_related_blog_slug?: string | null
          id?: string
          keywords?: string[] | null
          meta_description?: string | null
          no_follow?: boolean | null
          no_index?: boolean | null
          og_description?: string | null
          og_image_path?: string | null
          og_title?: string | null
          page_path?: string
          page_title?: string | null
          twitter_description?: string | null
          twitter_image_path?: string | null
          twitter_title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      portfolio_access_codes: {
        Row: {
          active: boolean
          code: string
          created_at: string
          id: string
          label: string
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          id?: string
          label: string
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          id?: string
          label?: string
        }
        Relationships: []
      }
      portfolio_access_logs: {
        Row: {
          code_id: string | null
          created_at: string
          id: string
          portfolio: string
          user_agent: string | null
        }
        Insert: {
          code_id?: string | null
          created_at?: string
          id?: string
          portfolio: string
          user_agent?: string | null
        }
        Update: {
          code_id?: string | null
          created_at?: string
          id?: string
          portfolio?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_access_logs_code_id_fkey"
            columns: ["code_id"]
            isOneToOne: false
            referencedRelation: "portfolio_access_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_content_cache: {
        Row: {
          cover_image: string | null
          created_at: string
          html_content: string
          id: string
          month_year: string | null
          name: string
          notion_page_id: string
          synced_at: string
          tags: string[] | null
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          html_content: string
          id?: string
          month_year?: string | null
          name: string
          notion_page_id: string
          synced_at?: string
          tags?: string[] | null
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          html_content?: string
          id?: string
          month_year?: string | null
          name?: string
          notion_page_id?: string
          synced_at?: string
          tags?: string[] | null
        }
        Relationships: []
      }
      portfolio_listing_cache: {
        Row: {
          cover_image: string | null
          created_at: string
          database_id: string
          date: string | null
          has_nda: boolean
          id: string
          month_year: string | null
          name: string
          notion_page_id: string
          synced_at: string
          tags: string[] | null
          text: string | null
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          database_id: string
          date?: string | null
          has_nda?: boolean
          id?: string
          month_year?: string | null
          name: string
          notion_page_id: string
          synced_at?: string
          tags?: string[] | null
          text?: string | null
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          database_id?: string
          date?: string | null
          has_nda?: boolean
          id?: string
          month_year?: string | null
          name?: string
          notion_page_id?: string
          synced_at?: string
          tags?: string[] | null
          text?: string | null
        }
        Relationships: []
      }
      sync_metadata: {
        Row: {
          last_synced_at: string
          sync_type: string
        }
        Insert: {
          last_synced_at?: string
          sync_type: string
        }
        Update: {
          last_synced_at?: string
          sync_type?: string
        }
        Relationships: []
      }
      workshop_quote_requests: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          phase_four: string | null
          phase_one: string | null
          phase_three: string | null
          phase_two: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          phase_four?: string | null
          phase_one?: string | null
          phase_three?: string | null
          phase_two?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          phase_four?: string | null
          phase_one?: string | null
          phase_three?: string | null
          phase_two?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
