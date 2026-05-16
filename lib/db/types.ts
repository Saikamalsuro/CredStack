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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      advisor_sessions: {
        Row: {
          created_at: string
          id: string
          llm_explanations: Json
          monthly_spend: number
          preferences: Json
          recommended_card_ids: string[]
          spending_profile: Json
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          llm_explanations?: Json
          monthly_spend: number
          preferences?: Json
          recommended_card_ids: string[]
          spending_profile: Json
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          llm_explanations?: Json
          monthly_spend?: number
          preferences?: Json
          recommended_card_ids?: string[]
          spending_profile?: Json
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advisor_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      analyzer_runs: {
        Row: {
          category_breakdown: Json
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          insights: Json
          overall_score: number | null
          rewards_optimization: number | null
          risk_factors: Json
          risk_score: number | null
          spending_efficiency: number | null
          statement_period_end: string | null
          statement_period_start: string | null
          status: string
          total_rewards_paise: number | null
          total_spend_paise: number | null
          uploaded_file_path: string | null
          user_id: string
        }
        Insert: {
          category_breakdown?: Json
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          insights?: Json
          overall_score?: number | null
          rewards_optimization?: number | null
          risk_factors?: Json
          risk_score?: number | null
          spending_efficiency?: number | null
          statement_period_end?: string | null
          statement_period_start?: string | null
          status?: string
          total_rewards_paise?: number | null
          total_spend_paise?: number | null
          uploaded_file_path?: string | null
          user_id: string
        }
        Update: {
          category_breakdown?: Json
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          insights?: Json
          overall_score?: number | null
          rewards_optimization?: number | null
          risk_factors?: Json
          risk_score?: number | null
          spending_efficiency?: number | null
          statement_period_end?: string | null
          statement_period_start?: string | null
          status?: string
          total_rewards_paise?: number | null
          total_spend_paise?: number | null
          uploaded_file_path?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analyzer_runs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      card_benefits: {
        Row: {
          benefit_type: string | null
          card_id: string
          created_at: string
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          title: string
        }
        Insert: {
          benefit_type?: string | null
          card_id: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          title: string
        }
        Update: {
          benefit_type?: string | null
          card_id?: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_benefits_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      card_exclusions: {
        Row: {
          card_id: string
          category: Database["public"]["Enums"]["reward_category"]
        }
        Insert: {
          card_id: string
          category: Database["public"]["Enums"]["reward_category"]
        }
        Update: {
          card_id?: string
          category?: Database["public"]["Enums"]["reward_category"]
        }
        Relationships: [
          {
            foreignKeyName: "card_exclusions_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      card_insurance: {
        Row: {
          card_id: string
          conditions: string | null
          cover_amount: number
          cover_type: string
          created_at: string
          id: string
        }
        Insert: {
          card_id: string
          conditions?: string | null
          cover_amount: number
          cover_type: string
          created_at?: string
          id?: string
        }
        Update: {
          card_id?: string
          conditions?: string | null
          cover_amount?: number
          cover_type?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_insurance_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      card_milestones: {
        Row: {
          card_id: string
          created_at: string
          id: string
          period: string
          reward_description: string
          reward_value: number
          spend_threshold: number
        }
        Insert: {
          card_id: string
          created_at?: string
          id?: string
          period?: string
          reward_description: string
          reward_value: number
          spend_threshold: number
        }
        Update: {
          card_id?: string
          created_at?: string
          id?: string
          period?: string
          reward_description?: string
          reward_value?: number
          spend_threshold?: number
        }
        Relationships: [
          {
            foreignKeyName: "card_milestones_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      card_offers: {
        Row: {
          card_id: string
          created_at: string | null
          id: string
          match_confidence: number
          match_reason: string
          offer_id: string
        }
        Insert: {
          card_id: string
          created_at?: string | null
          id?: string
          match_confidence: number
          match_reason: string
          offer_id: string
        }
        Update: {
          card_id?: string
          created_at?: string | null
          id?: string
          match_confidence?: number
          match_reason?: string
          offer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_offers_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_offers_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
      card_payments: {
        Row: {
          created_at: string
          due_date: string
          id: string
          min_due: number
          paid_amount: number | null
          paid_at: string | null
          total_due: number
          user_card_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          due_date: string
          id?: string
          min_due: number
          paid_amount?: number | null
          paid_at?: string | null
          total_due: number
          user_card_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          due_date?: string
          id?: string
          min_due?: number
          paid_amount?: number | null
          paid_at?: string | null
          total_due?: number
          user_card_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_payments_user_card_id_fkey"
            columns: ["user_card_id"]
            isOneToOne: false
            referencedRelation: "user_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      card_reward_rules: {
        Row: {
          card_id: string
          category: Database["public"]["Enums"]["reward_category"]
          created_at: string
          display_order: number | null
          id: string
          monthly_cap: number | null
          notes: string | null
          quarterly_cap: number | null
          reward_rate_pct: number
        }
        Insert: {
          card_id: string
          category: Database["public"]["Enums"]["reward_category"]
          created_at?: string
          display_order?: number | null
          id?: string
          monthly_cap?: number | null
          notes?: string | null
          quarterly_cap?: number | null
          reward_rate_pct: number
        }
        Update: {
          card_id?: string
          category?: Database["public"]["Enums"]["reward_category"]
          created_at?: string
          display_order?: number | null
          id?: string
          monthly_cap?: number | null
          notes?: string | null
          quarterly_cap?: number | null
          reward_rate_pct?: number
        }
        Relationships: [
          {
            foreignKeyName: "card_reward_rules_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      cards: {
        Row: {
          annual_fee: number
          annual_fee_waiver_spend: number | null
          apply_url: string | null
          apr_max: number
          apr_min: number
          base_reward_rate: number
          card_color_gradient: string
          categories: Database["public"]["Enums"]["card_category"][]
          changelog: Json
          created_at: string
          credit_limit_max: number
          credit_limit_min: number
          data_last_verified_at: string | null
          data_source_urls: string[] | null
          documentation_required: string[] | null
          domestic_lounges_per_year: number | null
          embedding: string | null
          emi_conversion_charge_pct: number | null
          featured: boolean
          forex_markup_pct: number
          fuel_surcharge_waiver: boolean
          id: string
          image_url: string | null
          intl_lounges_per_year: number | null
          is_active: boolean
          is_lifetime_free: boolean
          issuer: string
          joining_fee: number
          late_payment_fee_text: string | null
          lounge_guest_visits: boolean | null
          lounge_program: string | null
          max_age: number | null
          min_age: number | null
          min_credit_score: number | null
          min_income: number
          mitc_url: string | null
          name: string
          network: Database["public"]["Enums"]["card_network"]
          point_value_paise: number | null
          popular: boolean
          rating: number | null
          review_count: number | null
          reviewer: string | null
          reward_capping_monthly: number | null
          reward_description: string
          reward_expiry_months: number | null
          reward_type: Database["public"]["Enums"]["reward_type"]
          self_employed_eligible: boolean | null
          slug: string
          tier: Database["public"]["Enums"]["card_tier"] | null
          updated_at: string
          welcome_bonus_text: string | null
          welcome_bonus_value: number | null
        }
        Insert: {
          annual_fee?: number
          annual_fee_waiver_spend?: number | null
          apply_url?: string | null
          apr_max?: number
          apr_min?: number
          base_reward_rate?: number
          card_color_gradient?: string
          categories?: Database["public"]["Enums"]["card_category"][]
          changelog?: Json
          created_at?: string
          credit_limit_max?: number
          credit_limit_min?: number
          data_last_verified_at?: string | null
          data_source_urls?: string[] | null
          documentation_required?: string[] | null
          domestic_lounges_per_year?: number | null
          embedding?: string | null
          emi_conversion_charge_pct?: number | null
          featured?: boolean
          forex_markup_pct?: number
          fuel_surcharge_waiver?: boolean
          id?: string
          image_url?: string | null
          intl_lounges_per_year?: number | null
          is_active?: boolean
          is_lifetime_free?: boolean
          issuer: string
          joining_fee?: number
          late_payment_fee_text?: string | null
          lounge_guest_visits?: boolean | null
          lounge_program?: string | null
          max_age?: number | null
          min_age?: number | null
          min_credit_score?: number | null
          min_income?: number
          mitc_url?: string | null
          name: string
          network: Database["public"]["Enums"]["card_network"]
          point_value_paise?: number | null
          popular?: boolean
          rating?: number | null
          review_count?: number | null
          reviewer?: string | null
          reward_capping_monthly?: number | null
          reward_description: string
          reward_expiry_months?: number | null
          reward_type: Database["public"]["Enums"]["reward_type"]
          self_employed_eligible?: boolean | null
          slug: string
          tier?: Database["public"]["Enums"]["card_tier"] | null
          updated_at?: string
          welcome_bonus_text?: string | null
          welcome_bonus_value?: number | null
        }
        Update: {
          annual_fee?: number
          annual_fee_waiver_spend?: number | null
          apply_url?: string | null
          apr_max?: number
          apr_min?: number
          base_reward_rate?: number
          card_color_gradient?: string
          categories?: Database["public"]["Enums"]["card_category"][]
          changelog?: Json
          created_at?: string
          credit_limit_max?: number
          credit_limit_min?: number
          data_last_verified_at?: string | null
          data_source_urls?: string[] | null
          documentation_required?: string[] | null
          domestic_lounges_per_year?: number | null
          embedding?: string | null
          emi_conversion_charge_pct?: number | null
          featured?: boolean
          forex_markup_pct?: number
          fuel_surcharge_waiver?: boolean
          id?: string
          image_url?: string | null
          intl_lounges_per_year?: number | null
          is_active?: boolean
          is_lifetime_free?: boolean
          issuer?: string
          joining_fee?: number
          late_payment_fee_text?: string | null
          lounge_guest_visits?: boolean | null
          lounge_program?: string | null
          max_age?: number | null
          min_age?: number | null
          min_credit_score?: number | null
          min_income?: number
          mitc_url?: string | null
          name?: string
          network?: Database["public"]["Enums"]["card_network"]
          point_value_paise?: number | null
          popular?: boolean
          rating?: number | null
          review_count?: number | null
          reviewer?: string | null
          reward_capping_monthly?: number | null
          reward_description?: string
          reward_expiry_months?: number | null
          reward_type?: Database["public"]["Enums"]["reward_type"]
          self_employed_eligible?: boolean | null
          slug?: string
          tier?: Database["public"]["Enums"]["card_tier"] | null
          updated_at?: string
          welcome_bonus_text?: string | null
          welcome_bonus_value?: number | null
        }
        Relationships: []
      }
      merchants: {
        Row: {
          aliases: string[] | null
          category: Database["public"]["Enums"]["offer_category"]
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          popular: boolean | null
          primary_domain: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          aliases?: string[] | null
          category: Database["public"]["Enums"]["offer_category"]
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          popular?: boolean | null
          primary_domain?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          aliases?: string[] | null
          category?: Database["public"]["Enums"]["offer_category"]
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          popular?: boolean | null
          primary_domain?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      offers: {
        Row: {
          bin_prefixes: string[] | null
          category: Database["public"]["Enums"]["offer_category"]
          confidence_band: Database["public"]["Enums"]["confidence_band"]
          confidence_score: number
          created_at: string | null
          description: string | null
          eligible_card_ids: string[] | null
          eligible_card_networks: string[] | null
          eligible_issuers: string[] | null
          ends_at: string | null
          excluded_card_ids: string[] | null
          external_id: string | null
          id: string
          is_active: boolean | null
          manually_verified: boolean | null
          max_value: number | null
          merchant_id: string | null
          merchant_name: string | null
          min_txn: number | null
          offer_type: Database["public"]["Enums"]["offer_type"]
          raw_data: Json | null
          scraped_at: string
          source_id: string | null
          source_url: string
          starts_at: string | null
          title: string
          updated_at: string | null
          value_flat: number | null
          value_pct: number | null
        }
        Insert: {
          bin_prefixes?: string[] | null
          category: Database["public"]["Enums"]["offer_category"]
          confidence_band?: Database["public"]["Enums"]["confidence_band"]
          confidence_score?: number
          created_at?: string | null
          description?: string | null
          eligible_card_ids?: string[] | null
          eligible_card_networks?: string[] | null
          eligible_issuers?: string[] | null
          ends_at?: string | null
          excluded_card_ids?: string[] | null
          external_id?: string | null
          id?: string
          is_active?: boolean | null
          manually_verified?: boolean | null
          max_value?: number | null
          merchant_id?: string | null
          merchant_name?: string | null
          min_txn?: number | null
          offer_type: Database["public"]["Enums"]["offer_type"]
          raw_data?: Json | null
          scraped_at?: string
          source_id?: string | null
          source_url: string
          starts_at?: string | null
          title: string
          updated_at?: string | null
          value_flat?: number | null
          value_pct?: number | null
        }
        Update: {
          bin_prefixes?: string[] | null
          category?: Database["public"]["Enums"]["offer_category"]
          confidence_band?: Database["public"]["Enums"]["confidence_band"]
          confidence_score?: number
          created_at?: string | null
          description?: string | null
          eligible_card_ids?: string[] | null
          eligible_card_networks?: string[] | null
          eligible_issuers?: string[] | null
          ends_at?: string | null
          excluded_card_ids?: string[] | null
          external_id?: string | null
          id?: string
          is_active?: boolean | null
          manually_verified?: boolean | null
          max_value?: number | null
          merchant_id?: string | null
          merchant_name?: string | null
          min_txn?: number | null
          offer_type?: Database["public"]["Enums"]["offer_type"]
          raw_data?: Json | null
          scraped_at?: string
          source_id?: string | null
          source_url?: string
          starts_at?: string | null
          title?: string
          updated_at?: string | null
          value_flat?: number | null
          value_pct?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "offers_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "scrape_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          city: string | null
          created_at: string
          credit_score: number | null
          email: string | null
          employment_type: string | null
          full_name: string | null
          id: string
          monthly_income: number | null
          onboarded_at: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          age?: number | null
          city?: string | null
          created_at?: string
          credit_score?: number | null
          email?: string | null
          employment_type?: string | null
          full_name?: string | null
          id: string
          monthly_income?: number | null
          onboarded_at?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          age?: number | null
          city?: string | null
          created_at?: string
          credit_score?: number | null
          email?: string | null
          employment_type?: string | null
          full_name?: string | null
          id?: string
          monthly_income?: number | null
          onboarded_at?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          body: string
          card_id: string
          created_at: string
          helpful_count: number | null
          id: string
          is_verified_cardholder: boolean | null
          rating: number
          title: string | null
          user_id: string
        }
        Insert: {
          body: string
          card_id: string
          created_at?: string
          helpful_count?: number | null
          id?: string
          is_verified_cardholder?: boolean | null
          rating: number
          title?: string | null
          user_id: string
        }
        Update: {
          body?: string
          card_id?: string
          created_at?: string
          helpful_count?: number | null
          id?: string
          is_verified_cardholder?: boolean | null
          rating?: number
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scrape_runs: {
        Row: {
          cache_hit: boolean | null
          duration_ms: number | null
          error: string | null
          finished_at: string | null
          firecrawl_credits: number | null
          http_status: number | null
          id: string
          metadata: Json | null
          offers_expired: number | null
          offers_found: number | null
          offers_new: number | null
          offers_updated: number | null
          raw_response_size_bytes: number | null
          source_id: string | null
          started_at: string
          status: string
          triggered_by: string
        }
        Insert: {
          cache_hit?: boolean | null
          duration_ms?: number | null
          error?: string | null
          finished_at?: string | null
          firecrawl_credits?: number | null
          http_status?: number | null
          id?: string
          metadata?: Json | null
          offers_expired?: number | null
          offers_found?: number | null
          offers_new?: number | null
          offers_updated?: number | null
          raw_response_size_bytes?: number | null
          source_id?: string | null
          started_at?: string
          status: string
          triggered_by: string
        }
        Update: {
          cache_hit?: boolean | null
          duration_ms?: number | null
          error?: string | null
          finished_at?: string | null
          firecrawl_credits?: number | null
          http_status?: number | null
          id?: string
          metadata?: Json | null
          offers_expired?: number | null
          offers_found?: number | null
          offers_new?: number | null
          offers_updated?: number | null
          raw_response_size_bytes?: number | null
          source_id?: string | null
          started_at?: string
          status?: string
          triggered_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "scrape_runs_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "scrape_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      scrape_sources: {
        Row: {
          cache_ttl_seconds: number
          consecutive_failures: number | null
          created_at: string | null
          cron_schedule: string
          enabled: boolean | null
          firecrawl_options: Json | null
          id: string
          last_run_at: string | null
          last_success_at: string | null
          name: string
          next_run_at: string | null
          notes: string | null
          parser_module: string
          slug: string
          source_type: Database["public"]["Enums"]["source_type"]
          updated_at: string | null
          url: string
        }
        Insert: {
          cache_ttl_seconds?: number
          consecutive_failures?: number | null
          created_at?: string | null
          cron_schedule: string
          enabled?: boolean | null
          firecrawl_options?: Json | null
          id?: string
          last_run_at?: string | null
          last_success_at?: string | null
          name: string
          next_run_at?: string | null
          notes?: string | null
          parser_module: string
          slug: string
          source_type: Database["public"]["Enums"]["source_type"]
          updated_at?: string | null
          url: string
        }
        Update: {
          cache_ttl_seconds?: number
          consecutive_failures?: number | null
          created_at?: string | null
          cron_schedule?: string
          enabled?: boolean | null
          firecrawl_options?: Json | null
          id?: string
          last_run_at?: string | null
          last_success_at?: string | null
          name?: string
          next_run_at?: string | null
          notes?: string | null
          parser_module?: string
          slug?: string
          source_type?: Database["public"]["Enums"]["source_type"]
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount_paise: number
          category: Database["public"]["Enums"]["reward_category"] | null
          created_at: string
          id: string
          is_reversed: boolean | null
          merchant: string
          merchant_normalized: string | null
          raw_description: string | null
          reward_earned_paise: number | null
          source: string
          txn_date: string
          user_card_id: string
          user_id: string
        }
        Insert: {
          amount_paise: number
          category?: Database["public"]["Enums"]["reward_category"] | null
          created_at?: string
          id?: string
          is_reversed?: boolean | null
          merchant: string
          merchant_normalized?: string | null
          raw_description?: string | null
          reward_earned_paise?: number | null
          source?: string
          txn_date: string
          user_card_id: string
          user_id: string
        }
        Update: {
          amount_paise?: number
          category?: Database["public"]["Enums"]["reward_category"] | null
          created_at?: string
          id?: string
          is_reversed?: boolean | null
          merchant?: string
          merchant_normalized?: string | null
          raw_description?: string | null
          reward_earned_paise?: number | null
          source?: string
          txn_date?: string
          user_card_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_card_id_fkey"
            columns: ["user_card_id"]
            isOneToOne: false
            referencedRelation: "user_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_cards: {
        Row: {
          added_at: string
          card_id: string
          card_last_four: string | null
          credit_limit: number | null
          due_day: number | null
          id: string
          is_primary: boolean | null
          nickname: string | null
          removed_at: string | null
          statement_day: number | null
          user_id: string
        }
        Insert: {
          added_at?: string
          card_id: string
          card_last_four?: string | null
          credit_limit?: number | null
          due_day?: number | null
          id?: string
          is_primary?: boolean | null
          nickname?: string | null
          removed_at?: string | null
          statement_day?: number | null
          user_id: string
        }
        Update: {
          added_at?: string
          card_id?: string
          card_last_four?: string | null
          credit_limit?: number | null
          due_day?: number | null
          id?: string
          is_primary?: boolean | null
          nickname?: string | null
          removed_at?: string | null
          statement_day?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_cards_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_cards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      non_credit_cards: {
        Row: {
          id: string
          slug: string
          name: string
          issuer: string
          card_type: Database["public"]["Enums"]["non_credit_card_type"]
          network: Database["public"]["Enums"]["card_network"]
          annual_fee: number
          joining_fee: number
          forex_markup_pct: number
          atm_withdrawal_limit_daily: number | null
          pos_limit_daily: number | null
          key_features: string[]
          linked_account_required: boolean
          image_url: string | null
          card_color_gradient: string
          apply_url: string | null
          data_pending: boolean
          data_last_verified_at: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          issuer: string
          card_type: Database["public"]["Enums"]["non_credit_card_type"]
          network: Database["public"]["Enums"]["card_network"]
          annual_fee?: number
          joining_fee?: number
          forex_markup_pct?: number
          atm_withdrawal_limit_daily?: number | null
          pos_limit_daily?: number | null
          key_features?: string[]
          linked_account_required?: boolean
          image_url?: string | null
          card_color_gradient?: string
          apply_url?: string | null
          data_pending?: boolean
          data_last_verified_at?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          issuer?: string
          card_type?: Database["public"]["Enums"]["non_credit_card_type"]
          network?: Database["public"]["Enums"]["card_network"]
          annual_fee?: number
          joining_fee?: number
          forex_markup_pct?: number
          atm_withdrawal_limit_daily?: number | null
          pos_limit_daily?: number | null
          key_features?: string[]
          linked_account_required?: boolean
          image_url?: string | null
          card_color_gradient?: string
          apply_url?: string | null
          data_pending?: boolean
          data_last_verified_at?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      card_review_votes: {
        Row: { id: string; user_id: string; review_id: string; created_at: string }
        Insert: { id?: string; user_id: string; review_id: string; created_at?: string }
        Update: { id?: string; user_id?: string; review_id?: string; created_at?: string }
        Relationships: []
      }
      expert_reviews: {
        Row: {
          id: string
          card_id: string
          reviewer_name: string
          reviewer_title: string | null
          body: string
          rating: number | null
          pros: string[]
          cons: string[]
          use_case: string | null
          published_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          card_id: string
          reviewer_name: string
          reviewer_title?: string | null
          body: string
          rating?: number | null
          pros?: string[]
          cons?: string[]
          use_case?: string | null
          published_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          card_id?: string
          reviewer_name?: string
          reviewer_title?: string | null
          body?: string
          rating?: number | null
          pros?: string[]
          cons?: string[]
          use_case?: string | null
          published_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_applications: {
        Row: {
          applied_date: string
          card_id: string
          created_at: string
          id: string
          notes: string | null
          reference_number: string | null
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          applied_date: string
          card_id: string
          created_at?: string
          id?: string
          notes?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          applied_date?: string
          card_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_referrals: {
        Row: {
          card_id: string | null
          created_at: string
          credited_date: string | null
          expected_bonus: number | null
          id: string
          notes: string | null
          referred_date: string
          referred_name: string
          status: Database["public"]["Enums"]["referral_status"]
          user_id: string
        }
        Insert: {
          card_id?: string | null
          created_at?: string
          credited_date?: string | null
          expected_bonus?: number | null
          id?: string
          notes?: string | null
          referred_date?: string
          referred_name: string
          status?: Database["public"]["Enums"]["referral_status"]
          user_id: string
        }
        Update: {
          card_id?: string | null
          created_at?: string
          credited_date?: string | null
          expected_bonus?: number | null
          id?: string
          notes?: string | null
          referred_date?: string
          referred_name?: string
          status?: Database["public"]["Enums"]["referral_status"]
          user_id?: string
        }
        Relationships: []
      }
      user_wishlists: {
        Row: {
          card_id: string
          created_at: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          card_id: string
          created_at?: string
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          card_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_lounge_visits: {
        Row: {
          created_at: string
          guest_count: number | null
          id: string
          lounge_name: string
          notes: string | null
          user_card_id: string
          user_id: string
          visit_date: string
          visit_type: string
        }
        Insert: {
          created_at?: string
          guest_count?: number | null
          id?: string
          lounge_name: string
          notes?: string | null
          user_card_id: string
          user_id: string
          visit_date: string
          visit_type: string
        }
        Update: {
          created_at?: string
          guest_count?: number | null
          id?: string
          lounge_name?: string
          notes?: string | null
          user_card_id?: string
          user_id?: string
          visit_date?: string
          visit_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_lounge_visits_user_card_id_fkey"
            columns: ["user_card_id"]
            isOneToOne: false
            referencedRelation: "user_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_lounge_visits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_helpful_count: { Args: { p_review_id: string }; Returns: void }
      decrement_helpful_count: { Args: { p_review_id: string }; Returns: void }
      fuzzy_match_card: {
        Args: { query: string }
        Returns: {
          id: string
          name: string
          score: number
          slug: string
        }[]
      }
      get_similar_card_slugs: {
        Args: { k?: number; target_slug: string }
        Returns: {
          similarity: number
          slug: string
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      card_category:
        | "travel"
        | "cashback"
        | "rewards"
        | "business"
        | "student"
        | "premium"
        | "fuel"
        | "shopping"
      application_status:
        | "applied"
        | "under_review"
        | "approved"
        | "rejected"
        | "received"
      card_network: "visa" | "mastercard" | "amex" | "rupay" | "discover"
      non_credit_card_type: "debit" | "prepaid"
      card_tier:
        | "entry"
        | "lifestyle"
        | "premium"
        | "super_premium"
        | "secured"
        | "student"
      referral_status: "pending" | "credited" | "rejected"
      confidence_band: "verified" | "high" | "medium" | "low"
      offer_category:
        | "food_delivery"
        | "dining"
        | "grocery"
        | "ecommerce_general"
        | "fashion"
        | "electronics"
        | "travel_flight"
        | "travel_hotel"
        | "travel_cab"
        | "fuel"
        | "utility"
        | "entertainment"
        | "health_wellness"
        | "education"
        | "insurance"
        | "lifestyle"
        | "other"
      offer_type:
        | "cashback"
        | "instant_discount"
        | "reward_multiplier"
        | "voucher"
        | "bogo"
        | "no_cost_emi"
        | "milestone"
        | "welcome"
        | "lounge_access"
        | "other"
      reward_category:
        | "dining"
        | "fuel"
        | "travel"
        | "shopping_online"
        | "shopping_offline"
        | "grocery"
        | "utilities"
        | "rent"
        | "wallet"
        | "government"
        | "education"
        | "insurance"
        | "smartbuy"
        | "flipkart"
        | "amazon"
        | "myntra"
        | "swiggy"
        | "zomato"
        | "uber"
        | "makemytrip"
        | "shopping"
        | "other"
      reward_type: "points" | "cashback" | "miles"
      source_type: "bank_hub" | "aggregator" | "merchant" | "manual"
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
    Enums: {
      card_category: [
        "travel",
        "cashback",
        "rewards",
        "business",
        "student",
        "premium",
        "fuel",
        "shopping",
      ],
      card_network: ["visa", "mastercard", "amex", "rupay", "discover"],
      confidence_band: ["verified", "high", "medium", "low"],
      offer_category: [
        "food_delivery",
        "dining",
        "grocery",
        "ecommerce_general",
        "fashion",
        "electronics",
        "travel_flight",
        "travel_hotel",
        "travel_cab",
        "fuel",
        "utility",
        "entertainment",
        "health_wellness",
        "education",
        "insurance",
        "lifestyle",
        "other",
      ],
      offer_type: [
        "cashback",
        "instant_discount",
        "reward_multiplier",
        "voucher",
        "bogo",
        "no_cost_emi",
        "milestone",
        "welcome",
        "lounge_access",
        "other",
      ],
      reward_category: [
        "dining",
        "fuel",
        "travel",
        "shopping_online",
        "shopping_offline",
        "grocery",
        "utilities",
        "rent",
        "wallet",
        "government",
        "education",
        "insurance",
        "smartbuy",
        "flipkart",
        "amazon",
        "myntra",
        "swiggy",
        "zomato",
        "uber",
        "makemytrip",
        "shopping",
        "other",
      ],
      reward_type: ["points", "cashback", "miles"],
      source_type: ["bank_hub", "aggregator", "merchant", "manual"],
    },
  },
} as const
