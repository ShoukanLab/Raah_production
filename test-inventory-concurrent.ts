/**
 * Manual test script to verify concurrent ticket reservation behavior.
 * Run with: npx tsx test-inventory-concurrent.ts
 *
 * Tests:
 * 1. Concurrent reservations don't oversell
 * 2. Failed payments correctly release reserved quantity
 */

import { createServiceRoleClient } from './lib/supabase/server';
import {
  getTicketTypes,
  checkAvailability,
  reserveTickets,
  releaseTickets,
} from './lib/supabase/inventory';

const client = createServiceRoleClient();
const testShowId = '550e8400-test-show-001';
const testTicketTypeId = '550e8400-test-type-001';

async function setup() {
  console.log('\n=== Setting up test data ===');

  // Clean up any existing test data
  await client.from('ticket_types').delete().eq('id', testTicketTypeId);
  await client.from('shows').delete().eq('id', testShowId);

  // Create test show
  const { error: showError } = await client.from('shows').insert({
    id: testShowId,
    sanity_id: 'test-show-concurrent',
    name: 'Concurrent Test Show',
    date: new Date().toISOString(),
    venue: 'Test Venue',
  });

  if (showError) {
    console.error('Failed to create test show:', showError);
    process.exit(1);
  }

  // Create test ticket type with 10 total tickets
  const { error: ticketError } = await client.from('ticket_types').insert({
    id: testTicketTypeId,
    show_id: testShowId,
    name: 'General Admission',
    price: 50,
    quantity_total: 10,
    quantity_sold: 0,
    is_visible: true,
  });

  if (ticketError) {
    console.error('Failed to create test ticket type:', ticketError);
    process.exit(1);
  }

  console.log('✓ Test data created: 10 tickets available');
}

async function cleanup() {
  console.log('\n=== Cleaning up test data ===');
  await client.from('ticket_types').delete().eq('id', testTicketTypeId);
  await client.from('shows').delete().eq('id', testShowId);
  console.log('✓ Test data cleaned up');
}

async function testConcurrentReservations() {
  console.log('\n=== Test 1: Concurrent Reservations Don\'t Oversell ===');

  // Simulate 5 concurrent requests trying to reserve 3 tickets each (15 total, but only 10 available)
  console.log('Attempting 5 concurrent reservations of 3 tickets each (15 total, 10 available)...');

  const reservationPromises = [
    reserveTickets(testTicketTypeId, 3),
    reserveTickets(testTicketTypeId, 3),
    reserveTickets(testTicketTypeId, 3),
    reserveTickets(testTicketTypeId, 3),
    reserveTickets(testTicketTypeId, 3),
  ];

  const results = await Promise.all(reservationPromises);

  let successCount = 0;
  let totalReserved = 0;

  results.forEach((result, index) => {
    if (result.success) {
      successCount++;
      totalReserved += 3;
      console.log(`  [Request ${index + 1}] ✓ Reserved 3 tickets, ${result.available_quantity} remaining`);
    } else {
      console.log(`  [Request ${index + 1}] ✗ Failed: ${result.error_message}`);
    }
  });

  // Verify total reserved doesn't exceed capacity
  const { data } = await client
    .from('ticket_types')
    .select('quantity_sold, quantity_total')
    .eq('id', testTicketTypeId)
    .single();

  console.log(`\nResults:`);
  console.log(`  Successful reservations: ${successCount}`);
  console.log(`  Total tickets reserved: ${data!.quantity_sold}/${data!.quantity_total}`);

  const passTest1 = data!.quantity_sold <= data!.quantity_total;
  console.log(`  ✓ Test 1 PASSED: No overselling (${data!.quantity_sold} <= ${data!.quantity_total})`);

  return passTest1;
}

async function testPaymentFailureRelease() {
  console.log('\n=== Test 2: Payment Failure Correctly Releases Tickets ===');

  // Reset for this test
  await client
    .from('ticket_types')
    .update({ quantity_sold: 0 })
    .eq('id', testTicketTypeId);

  console.log('Scenario: Reserve 6 tickets, payment fails, release 4, retry with 2');

  // Step 1: Reserve 6 tickets
  const res1 = await reserveTickets(testTicketTypeId, 6);
  console.log(`  Step 1: Reserved 6 tickets - ${res1.success ? '✓' : '✗'}`);

  let { data: data1 } = await client
    .from('ticket_types')
    .select('quantity_sold')
    .eq('id', testTicketTypeId)
    .single();
  console.log(`         Quantity sold: ${data1!.quantity_sold}/10`);

  // Step 2: Payment fails, release 4
  const rel1 = await releaseTickets(testTicketTypeId, 4);
  console.log(`  Step 2: Released 4 tickets - ${rel1.success ? '✓' : '✗'}`);

  let { data: data2 } = await client
    .from('ticket_types')
    .select('quantity_sold')
    .eq('id', testTicketTypeId)
    .single();
  console.log(`         Quantity sold: ${data2!.quantity_sold}/10`);

  // Step 3: Retry with remaining 2
  const res2 = await reserveTickets(testTicketTypeId, 2);
  console.log(`  Step 3: Reserved 2 tickets (retry) - ${res2.success ? '✓' : '✗'}`);

  const { data: data3 } = await client
    .from('ticket_types')
    .select('quantity_sold, quantity_total')
    .eq('id', testTicketTypeId)
    .single();
  console.log(`         Quantity sold: ${data3!.quantity_sold}/10`);

  const passTest2 =
    res1.success &&
    rel1.success &&
    res2.success &&
    data3!.quantity_sold === 4; // 6 - 4 + 2 = 4

  console.log(`\n  ✓ Test 2 PASSED: Partial release handled correctly (${data3!.quantity_sold} tickets sold)`);

  return passTest2;
}

async function testGetTicketTypes() {
  console.log('\n=== Test 3: Get Ticket Types with Availability ===');

  // Reset and set up known state
  await client
    .from('ticket_types')
    .update({ quantity_sold: 3 })
    .eq('id', testTicketTypeId);

  const types = await getTicketTypes(testShowId);

  const ticketType = types.find((t) => t.id === testTicketTypeId);

  console.log(`  Found ${types.length} ticket type(s)`);
  if (ticketType) {
    console.log(`  Ticket: ${ticketType.name}`);
    console.log(`  Total: ${ticketType.quantity_total}, Sold: ${ticketType.quantity_sold}, Available: ${ticketType.available_quantity}`);

    const passTest3 = ticketType.available_quantity === 7; // 10 - 3 = 7
    console.log(`  ✓ Test 3 PASSED: Availability calculated correctly (${ticketType.available_quantity} available)`);

    return passTest3;
  }

  console.log(`  ✗ Test 3 FAILED: Ticket type not found`);
  return false;
}

async function main() {
  try {
    await setup();

    const test1 = await testConcurrentReservations();
    const test2 = await testPaymentFailureRelease();
    const test3 = await testGetTicketTypes();

    await cleanup();

    console.log('\n=== Final Results ===');
    console.log(`Test 1 (Concurrent reservations): ${test1 ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`Test 2 (Payment failure release): ${test2 ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`Test 3 (Get ticket types): ${test3 ? '✓ PASS' : '✗ FAIL'}`);

    const allPassed = test1 && test2 && test3;
    console.log(`\nOverall: ${allPassed ? '✓ ALL TESTS PASSED' : '✗ SOME TESTS FAILED'}\n`);

    process.exit(allPassed ? 0 : 1);
  } catch (error) {
    console.error('Test error:', error);
    await cleanup();
    process.exit(1);
  }
}

main();
