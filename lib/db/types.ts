export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
          updated_at: string
          welcome_bonus_text: string | null
          welcome_bonus_value: number | null
        }
        Insert: Partial<Database["public"]["Tables"]["cards"]["Row"]> & {
          issuer: string
          name: string
          network: Database["public"]["Enums"]["card_network"]
          reward_description: string
          reward_type: Database["public"]["Enums"]["reward_type"]
          slug: string
        }
        Update: Partial<Database["public"]["Tables"]["cards"]["Row"]>
        Relationships: []
      }
      offers: {
        Row: {
          applicable_card_slugs: string[] | null
          applicable_issuers: string[] | null
          applicable_networks: Database["public"]["Enums"]["card_network"][] | null
          description: string | null
          discount_type: string
          discount_value: number | null
          id: string
          is_active: boolean
          max_discount: number | null
          merchant: string
          min_txn_amount: number | null
          scraped_at: string
          source_hash: string
          source_url: string
          title: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: Partial<Database["public"]["Tables"]["offers"]["Row"]> & {
          discount_type: string
          merchant: string
          source_hash: string
          source_url: string
          title: string
        }
        Update: Partial<Database["public"]["Tables"]["offers"]["Row"]>
        Relationships: []
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
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string }
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>
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
        Insert: Partial<Database["public"]["Tables"]["reviews"]["Row"]> & {
          body: string
          card_id: string
          rating: number
          user_id: string
        }
        Update: Partial<Database["public"]["Tables"]["reviews"]["Row"]>
        Relationships: []
      }
      scrape_runs: {
        Row: {
          completed_at: string | null
          error_message: string | null
          id: string
          offers_added: number | null
          offers_found: number | null
          offers_updated: number | null
          source_url: string
          started_at: string
          status: string
        }
        Insert: Partial<Database["public"]["Tables"]["scrape_runs"]["Row"]> & {
          source_url: string
          status: string
        }
        Update: Partial<Database["public"]["Tables"]["scrape_runs"]["Row"]>
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
        Insert: Partial<Database["public"]["Tables"]["transactions"]["Row"]> & {
          amount_paise: number
          merchant: string
          txn_date: string
          user_card_id: string
          user_id: string
        }
        Update: Partial<Database["public"]["Tables"]["transactions"]["Row"]>
        Relationships: []
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
        Insert: Partial<Database["public"]["Tables"]["user_cards"]["Row"]> & {
          card_id: string
          user_id: string
        }
        Update: Partial<Database["public"]["Tables"]["user_cards"]["Row"]>
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
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
      card_network: "visa" | "mastercard" | "amex" | "rupay" | "discover"
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
    }
    CompositeTypes: { [_ in never]: never }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T]
