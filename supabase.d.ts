/* eslint-disable @typescript-eslint/no-redundant-type-constituents */export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  plaid: {
    Tables: {
      plaid_balances: {
        Row: {
          accounts: Json | null
          id: string
          plaid_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accounts?: Json | null
          id?: string
          plaid_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accounts?: Json | null
          id?: string
          plaid_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plaid_balances_plaid_id_fkey"
            columns: ["plaid_id"]
            isOneToOne: false
            referencedRelation: "plaid_link"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plaid_balances_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      budget_items: {
        Row: {
          budget_entry: string | null
          budget_item_name: string
          category_id: string
          created_at: string
          id: string
          projected_amount: number
          user_id: string
        }
        Insert: {
          budget_entry?: string | null
          budget_item_name: string
          category_id: string
          created_at?: string
          id?: string
          projected_amount: number
          user_id: string
        }
        Update: {
          budget_entry?: string | null
          budget_item_name?: string
          category_id?: string
          created_at?: string
          id?: string
          projected_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          budget_entry: string | null
          category_name: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          budget_entry?: string | null
          category_name: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          budget_entry?: string | null
          category_name?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      income_sources: {
        Row: {
          budget_entry: string | null
          created_at: string
          id: string
          income_source_name: string
          projected_amount: number
          user_id: string
        }
        Insert: {
          budget_entry?: string | null
          created_at?: string
          id?: string
          income_source_name: string
          projected_amount: number
          user_id: string
        }
        Update: {
          budget_entry?: string | null
          created_at?: string
          id?: string
          income_source_name?: string
          projected_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "income_sources_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      loans: {
        Row: {
          additional_payment: number | null
          created_at: string
          id: string
          interest_rate: number
          loan_name: string
          monthly_payment: number
          principal: number
          user_id: string | null
        }
        Insert: {
          additional_payment?: number | null
          created_at?: string
          id?: string
          interest_rate: number
          loan_name: string
          monthly_payment: number
          principal: number
          user_id?: string | null
        }
        Update: {
          additional_payment?: number | null
          created_at?: string
          id?: string
          interest_rate?: number
          loan_name?: string
          monthly_payment?: number
          principal?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      plaid_link: {
        Row: {
          access_token: string
          created_at: string
          id: string
          item_id: string
          user_id: string | null
        }
        Insert: {
          access_token: string
          created_at?: string
          id?: string
          item_id: string
          user_id?: string | null
        }
        Update: {
          access_token?: string
          created_at?: string
          id?: string
          item_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plaid_link_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          id: number
          name: string
          user: string | null
        }
        Insert: {
          id?: number
          name: string
          user?: string | null
        }
        Update: {
          id?: number
          name?: string
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
