import { serverSupabase } from "./server";
import { createClient } from "./client";

export const supabase =
  typeof window === "undefined" ? serverSupabase() : createClient();
