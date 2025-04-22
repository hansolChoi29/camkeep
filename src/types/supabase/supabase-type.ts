export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      answers: {
        Row: {
          contact_id: string
          content: string
          created_at: string
          id: string
          inquiry_id: string
          user_id: string
        }
        Insert: {
          contact_id?: string
          content: string
          created_at?: string
          id?: string
          inquiry_id?: string
          user_id?: string
        }
        Update: {
          contact_id?: string
          content?: string
          created_at?: string
          id?: string
          inquiry_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_inquiry_id_fkey"
            columns: ["inquiry_id"]
            isOneToOne: false
            referencedRelation: "inquiries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          check_in_date: string
          check_out_date: string
          created_at: string
          hotel_id: string
          id: string
          request: string[] | null
          room_id: string
          status: string
          total_amount: number
          user_first_name: string
          user_id: string
          user_last_name: string
        }
        Insert: {
          check_in_date: string
          check_out_date: string
          created_at?: string
          hotel_id?: string
          id?: string
          request?: string[] | null
          room_id?: string
          status: string
          total_amount: number
          user_first_name: string
          user_id?: string
          user_last_name: string
        }
        Update: {
          check_in_date?: string
          check_out_date?: string
          created_at?: string
          hotel_id?: string
          id?: string
          request?: string[] | null
          room_id?: string
          status?: string
          total_amount?: number
          user_first_name?: string
          user_id?: string
          user_last_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          booking_id: string | null
          content: string
          created_at: string
          hotel_id: string | null
          id: string
          room_id: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          booking_id?: string | null
          content: string
          created_at: string
          hotel_id?: string | null
          id?: string
          room_id?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          booking_id?: string | null
          content?: string
          created_at?: string
          hotel_id?: string | null
          id?: string
          room_id?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_cards: {
        Row: {
          card_number: string
          created_at: string
          cvv: string
          expiry_date: string
          id: string
          user_id: string
        }
        Insert: {
          card_number: string
          created_at?: string
          cvv: string
          expiry_date: string
          id?: string
          user_id: string
        }
        Update: {
          card_number?: string
          created_at?: string
          cvv?: string
          expiry_date?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_cards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      facilities: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          hotel_id: string
          id: string
          is_favorite: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string
          hotel_id?: string
          id?: string
          is_favorite?: boolean | null
          user_id?: string
        }
        Update: {
          created_at?: string
          hotel_id?: string
          id?: string
          is_favorite?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "farvorites_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farvorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_facility: {
        Row: {
          created_at: string
          facility_id: string
          hotel_id: string
          id: string
        }
        Insert: {
          created_at?: string
          facility_id: string
          hotel_id: string
          id?: string
        }
        Update: {
          created_at?: string
          facility_id?: string
          hotel_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Hotel_facilitiy_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hotel_facility_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_service: {
        Row: {
          created_at: string
          hotel_id: string
          id: string
          service_id: string
        }
        Insert: {
          created_at?: string
          hotel_id: string
          id?: string
          service_id: string
        }
        Update: {
          created_at?: string
          hotel_id?: string
          id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Hotel_service_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hotel_service_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      hotels: {
        Row: {
          address: string
          check_in: string
          check_out: string
          description: string
          facility_ids: string[] | null
          hotel_img_urls: Json | null
          id: string
          location: string
          main_img_url: string
          name: string
          service_ids: string[] | null
          stars: number
          user_id: string
        }
        Insert: {
          address: string
          check_in: string
          check_out: string
          description: string
          facility_ids?: string[] | null
          hotel_img_urls?: Json | null
          id?: string
          location: string
          main_img_url: string
          name: string
          service_ids?: string[] | null
          stars: number
          user_id?: string
        }
        Update: {
          address?: string
          check_in?: string
          check_out?: string
          description?: string
          facility_ids?: string[] | null
          hotel_img_urls?: Json | null
          id?: string
          location?: string
          main_img_url?: string
          name?: string
          service_ids?: string[] | null
          stars?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hotels_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiries: {
        Row: {
          assigned_to: string
          business_reply: string | null
          category: string
          content: string
          created_at: string
          id: string
          reply_created_at: string | null
          status: string
          title: string
          user_id: string
        }
        Insert: {
          assigned_to: string
          business_reply?: string | null
          category: string
          content: string
          created_at?: string
          id?: string
          reply_created_at?: string | null
          status?: string
          title: string
          user_id: string
        }
        Update: {
          assigned_to?: string
          business_reply?: string | null
          category?: string
          content?: string
          created_at?: string
          id?: string
          reply_created_at?: string | null
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_rooms_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          chat_room_id: string
          created_at: string
          id: number
          read: boolean
          sender_id: string
        }
        Insert: {
          chat_room_id?: string
          created_at?: string
          id?: number
          read: boolean
          sender_id?: string
        }
        Update: {
          chat_room_id?: string
          created_at?: string
          id?: number
          read?: boolean
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_room_id_fkey"
            columns: ["chat_room_id"]
            isOneToOne: false
            referencedRelation: "inquiries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      password_reset_requests: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          otp: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          otp: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          otp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "password_reset_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      policies: {
        Row: {
          created_at: string
          description: string | null
          hotel_id: string | null
          id: string
          policy_name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          hotel_id?: string | null
          id?: string
          policy_name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          hotel_id?: string | null
          id?: string
          policy_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "policies_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string
          created_at: string
          id: string
          rating: number
          review_img_url: Json | null
          room_id: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          rating: number
          review_img_url?: Json | null
          room_id?: string
          user_id?: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          rating?: number
          review_img_url?: Json | null
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          bed_type: string
          created_at: string
          hotel_id: string
          id: string
          is_breakfast_included: string
          option: Json | null
          price: number
          room_img_url: Json | null
          room_name: string
          room_type: string
          view: string
        }
        Insert: {
          bed_type: string
          created_at?: string
          hotel_id?: string
          id?: string
          is_breakfast_included: string
          option?: Json | null
          price: number
          room_img_url?: Json | null
          room_name: string
          room_type: string
          view: string
        }
        Update: {
          bed_type?: string
          created_at?: string
          hotel_id?: string
          id?: string
          is_breakfast_included?: string
          option?: Json | null
          price?: number
          room_img_url?: Json | null
          room_name?: string
          room_type?: string
          view?: string
        }
        Relationships: [
          {
            foreignKeyName: "rooms_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          business_number: string | null
          created_at: string
          email: string | null
          id: string
          nickname: string | null
          phone_number: string | null
          profile_img: string | null
          role: string
          user_info: Json | null
          user_name: string | null
        }
        Insert: {
          business_number?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nickname?: string | null
          phone_number?: string | null
          profile_img?: string | null
          role?: string
          user_info?: Json | null
          user_name?: string | null
        }
        Update: {
          business_number?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nickname?: string | null
          phone_number?: string | null
          profile_img?: string | null
          role?: string
          user_info?: Json | null
          user_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_reviews_with_user_and_room: {
        Args: { hotel_id: string }
        Returns: {
          review_id: string
          user_id: string
          content: string
          created_at: string
          nickname: string
          profile_img: string
          room_type: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
