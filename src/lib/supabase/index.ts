import { serverSupabase } from "./server";
import { browserSupabase } from "./client";

export const supabase =
  typeof window === "undefined" ? serverSupabase() : browserSupabase();
