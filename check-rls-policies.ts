import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌ Missing environment variables");
  process.exit(1);
}

const client = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function checkPolicies() {
  try {
    console.log("🔍 Checking RLS Policy State in Supabase\n");

    const tables = ["shows", "ticket_types", "customers", "orders", "order_items"];

    for (const table of tables) {
      console.log(`📋 Table: ${table}`);
      try {
        const { data: rows, error: err } = await client.from(table).select("*").limit(0);
        console.log(`   Status: ${err ? `ERROR: ${err.message}` : "SUCCESS (accessible)"}`);
      } catch (e) {
        console.log(`   Status: ERROR: ${e}`);
      }
    }

    console.log("\n\n📝 To view detailed RLS policies in Supabase Dashboard:");
    console.log("1. Open your Supabase project dashboard");
    console.log("2. Go to SQL Editor > New Query");
    console.log("3. Run this query:");
    console.log(`
    SELECT
      tablename,
      policyname,
      permissive,
      roles,
      qual as using_expression,
      with_check as with_check_expression
    FROM pg_policies
    WHERE schemaname = 'public'
    ORDER BY tablename, policyname;
    `);
  } catch (error) {
    console.error("Error:", error);
  }
}

checkPolicies();
