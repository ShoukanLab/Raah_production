import { createClient } from "@supabase/supabase-js";

// Test configuration from environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !ANON_KEY || !SERVICE_ROLE_KEY) {
  console.error("❌ Missing required environment variables");
  console.error("  NEXT_PUBLIC_SUPABASE_URL:", SUPABASE_URL ? "✓" : "✗");
  console.error("  NEXT_PUBLIC_SUPABASE_ANON_KEY:", ANON_KEY ? "✓" : "✗");
  console.error("  SUPABASE_SERVICE_ROLE_KEY:", SERVICE_ROLE_KEY ? "✓" : "✗");
  console.error("\nLoad variables from .env.local: export $(grep -v '^#' .env.local | xargs)");
  process.exit(1);
}

// Create clients
const anonClient = createClient(SUPABASE_URL, ANON_KEY);
const serviceRoleClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function testRLSPolicies() {
  console.log("🔒 Testing RLS Policies\n");

  // Test 1: Anon can read shows
  console.log("Test 1: Anon key reading shows (should succeed)");
  try {
    const { data, error } = await anonClient.from("shows").select("id").limit(1);
    if (error) {
      console.log(`❌ FAILED: ${error.message}`);
    } else {
      console.log(`✅ PASSED: Anon can read shows (found ${data.length} rows)`);
    }
  } catch (e) {
    console.log(`❌ ERROR: ${e}`);
  }

  // Test 2: Anon can read visible ticket_types
  console.log("\nTest 2: Anon key reading ticket_types (should succeed if is_visible=true)");
  try {
    const { data, error } = await anonClient
      .from("ticket_types")
      .select("id")
      .eq("is_visible", true)
      .limit(1);
    if (error) {
      console.log(`❌ FAILED: ${error.message}`);
    } else {
      console.log(`✅ PASSED: Anon can read visible ticket_types (found ${data.length} rows)`);
    }
  } catch (e) {
    console.log(`❌ ERROR: ${e}`);
  }

  // Test 3: Anon CANNOT read customers
  console.log("\nTest 3: Anon key reading customers (should be denied)");
  try {
    const { data, error } = await anonClient.from("customers").select("id").limit(1);
    if (error) {
      console.log(`✅ PASSED: Anon correctly denied - ${error.message}`);
    } else {
      console.log(`❌ FAILED: Anon should not be able to read customers, but found ${data.length} rows`);
    }
  } catch (e) {
    console.log(`❌ ERROR: ${e}`);
  }

  // Test 4: Anon CANNOT read orders
  console.log("\nTest 4: Anon key reading orders (should be denied)");
  try {
    const { data, error } = await anonClient.from("orders").select("id").limit(1);
    if (error) {
      console.log(`✅ PASSED: Anon correctly denied - ${error.message}`);
    } else {
      console.log(`❌ FAILED: Anon should not be able to read orders, but found ${data.length} rows`);
    }
  } catch (e) {
    console.log(`❌ ERROR: ${e}`);
  }

  // Test 5: Anon CANNOT read order_items
  console.log("\nTest 5: Anon key reading order_items (should be denied)");
  try {
    const { data, error } = await anonClient.from("order_items").select("id").limit(1);
    if (error) {
      console.log(`✅ PASSED: Anon correctly denied - ${error.message}`);
    } else {
      console.log(
        `❌ FAILED: Anon should not be able to read order_items, but found ${data.length} rows`
      );
    }
  } catch (e) {
    console.log(`❌ ERROR: ${e}`);
  }

  // Test 6: Service role CAN read shows
  console.log("\nTest 6: Service role key reading shows (should succeed)");
  try {
    const { data, error } = await serviceRoleClient.from("shows").select("id").limit(1);
    if (error) {
      console.log(`❌ FAILED: ${error.message}`);
    } else {
      console.log(`✅ PASSED: Service role can read shows (found ${data.length} rows)`);
    }
  } catch (e) {
    console.log(`❌ ERROR: ${e}`);
  }

  // Test 7: Service role CAN read customers
  console.log("\nTest 7: Service role key reading customers (should succeed)");
  try {
    const { data, error } = await serviceRoleClient.from("customers").select("id").limit(1);
    if (error) {
      console.log(`❌ FAILED: ${error.message}`);
    } else {
      console.log(`✅ PASSED: Service role can read customers (found ${data.length} rows)`);
    }
  } catch (e) {
    console.log(`❌ ERROR: ${e}`);
  }

  // Test 8: Service role CAN read orders
  console.log("\nTest 8: Service role key reading orders (should succeed)");
  try {
    const { data, error } = await serviceRoleClient.from("orders").select("id").limit(1);
    if (error) {
      console.log(`❌ FAILED: ${error.message}`);
    } else {
      console.log(`✅ PASSED: Service role can read orders (found ${data.length} rows)`);
    }
  } catch (e) {
    console.log(`❌ ERROR: ${e}`);
  }

  // Test 9: Service role CAN read order_items
  console.log("\nTest 9: Service role key reading order_items (should succeed)");
  try {
    const { data, error } = await serviceRoleClient.from("order_items").select("id").limit(1);
    if (error) {
      console.log(`❌ FAILED: ${error.message}`);
    } else {
      console.log(`✅ PASSED: Service role can read order_items (found ${data.length} rows)`);
    }
  } catch (e) {
    console.log(`❌ ERROR: ${e}`);
  }

  // Test 10: Service role CAN write to customers
  console.log("\nTest 10: Service role key writing to customers (should succeed)");
  try {
    const { data, error } = await serviceRoleClient
      .from("customers")
      .insert({
        email: `test-${Date.now()}@example.com`,
        first_name: "Test",
        last_name: "User",
      })
      .select();
    if (error) {
      console.log(`❌ FAILED: ${error.message}`);
    } else {
      console.log(`✅ PASSED: Service role can write to customers (inserted ID: ${data[0].id})`);
    }
  } catch (e) {
    console.log(`❌ ERROR: ${e}`);
  }

  console.log("\n🎯 RLS Policy Testing Complete\n");
}

testRLSPolicies().catch((e) => {
  console.error("Test runner failed:", e);
  process.exit(1);
});
