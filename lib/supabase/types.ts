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
      cards: {
        Row: {
          annual_fee: number
          benefits: string[]
          card_color: string
          category: string[]
          created_at: string
          credit_limit: Json
          featured: boolean
          foreign_transaction_fee: number
          fuel_surcharge_waiver: boolean
          id: string
          image_url: string
          interest_rate: Json
          issuer: string
          joining_fee: number
          lounge_access: Json | null
          min_income: number
          name: string
          network: Database["public"]["Enums"]["card_network"]
          popular: boolean
          rating: number
          review_count: number
          rewards: Json
          updated_at: string
          welcome_bonus: string | null
        }
        Insert: {
          annual_fee?: number
          benefits?: string[]
          card_color?: string
          category?: string[]
          created_at?: string
          credit_limit: Json
          featured?: boolean
          foreign_transaction_fee?: number
          fuel_surcharge_waiver?: boolean
          id: string
          image_url?: string
          interest_rate: Json
          issuer: string
          joining_fee?: number
          lounge_access?: Json | null
          min_income?: number
          name: string
          network: Database["public"]["Enums"]["card_network"]
          popular?: boolean
          rating?: number
          review_count?: number
          rewards: Json
          updated_at?: string
          welcome_bonus?: string | null
        }
        Update: {
          annual_fee?: number
          benefits?: string[]
          card_color?: string
          category?: string[]
          created_at?: string
          credit_limit?: Json
          featured?: boolean
          foreign_transaction_fee?: number
          fuel_surcharge_waiver?: boolean
          id?: string
          image_url?: string
          interest_rate?: Json
          issuer?: string
          joining_fee?: number
          lounge_access?: Json | null
          min_income?: number
          name?: string
          network?: Database["public"]["Enums"]["card_network"]
          popular?: boolean
          rating?: number
          review_count?: number
          rewards?: Json
          updated_at?: string
          welcome_bonus?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_cards: {
        Row: {
          added_at: string
          card_id: string
          is_primary: boolean
          user_id: string
        }
        Insert: {
          added_at?: string
          card_id: string
          is_primary?: boolean
          user_id: string
        }
        Update: {
          added_at?: string
          card_id?: string
          is_primary?: boolean
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
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      card_network: "visa" | "mastercard" | "amex" | "rupay" | "discover"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]

export const Constants = {
  public: {
    Enums: {
      card_network: ["visa", "mastercard", "amex", "rupay", "discover"],
    },
  },
} as const
