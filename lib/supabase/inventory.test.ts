import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createServiceRoleClient } from './server';
import {
  getTicketTypes,
  checkAvailability,
  reserveTickets,
  releaseTickets,
} from './inventory';

describe('Ticket Inventory Helpers', () => {
  const client = createServiceRoleClient();
  const testShowId = '550e8400-e29b-41d4-a716-446655440001';
  const testTicketTypeId = '550e8400-e29b-41d4-a716-446655440002';

  beforeEach(async () => {
    // Create test show and ticket type
    await client.from('shows').insert({
      id: testShowId,
      sanity_id: 'test-show-001',
      name: 'Test Show',
      date: new Date().toISOString(),
      venue: 'Test Venue',
    });

    await client.from('ticket_types').insert({
      id: testTicketTypeId,
      show_id: testShowId,
      name: 'General Admission',
      price: 50,
      quantity_total: 10,
      quantity_sold: 0,
      is_visible: true,
    });
  });

  afterEach(async () => {
    // Clean up test data
    await client.from('ticket_types').delete().eq('id', testTicketTypeId);
    await client.from('shows').delete().eq('id', testShowId);
  });

  describe('getTicketTypes', () => {
    it('should fetch ticket types with availability info', async () => {
      const types = await getTicketTypes(testShowId);

      expect(types).toHaveLength(1);
      expect(types[0]).toMatchObject({
        id: testTicketTypeId,
        name: 'General Admission',
        quantity_total: 10,
        quantity_sold: 0,
        available_quantity: 10,
      });
    });

    it('should only include visible ticket types', async () => {
      await client.from('ticket_types').insert({
        show_id: testShowId,
        name: 'Hidden Ticket',
        price: 100,
        quantity_total: 5,
        is_visible: false,
      });

      const types = await getTicketTypes(testShowId);

      expect(types).toHaveLength(1);
      expect(types[0].name).toBe('General Admission');
    });

    it('should calculate available_quantity correctly', async () => {
      await client
        .from('ticket_types')
        .update({ quantity_sold: 3 })
        .eq('id', testTicketTypeId);

      const types = await getTicketTypes(testShowId);

      expect(types[0].available_quantity).toBe(7);
    });
  });

  describe('checkAvailability', () => {
    it('should return true if sufficient inventory exists', async () => {
      const available = await checkAvailability(testTicketTypeId, 5);

      expect(available).toBe(true);
    });

    it('should return false if insufficient inventory', async () => {
      const available = await checkAvailability(testTicketTypeId, 15);

      expect(available).toBe(false);
    });

    it('should return false for non-existent ticket type', async () => {
      const available = await checkAvailability(
        '550e8400-0000-0000-0000-000000000000',
        5
      );

      expect(available).toBe(false);
    });

    it('should account for already-sold inventory', async () => {
      await client
        .from('ticket_types')
        .update({ quantity_sold: 8 })
        .eq('id', testTicketTypeId);

      const available = await checkAvailability(testTicketTypeId, 3);

      expect(available).toBe(true);
    });

    it('should return false when requesting exactly available + 1', async () => {
      await client
        .from('ticket_types')
        .update({ quantity_sold: 7 })
        .eq('id', testTicketTypeId);

      const available = await checkAvailability(testTicketTypeId, 4);

      expect(available).toBe(false);
    });
  });

  describe('reserveTickets', () => {
    it('should successfully reserve tickets', async () => {
      const result = await reserveTickets(testTicketTypeId, 3);

      expect(result.success).toBe(true);
      expect(result.available_quantity).toBe(7);
      expect(result.error_message).toBeNull();
    });

    it('should fail when insufficient inventory', async () => {
      const result = await reserveTickets(testTicketTypeId, 15);

      expect(result.success).toBe(false);
      expect(result.error_message).toBe('Not enough inventory available');
    });

    it('should atomically increment quantity_sold', async () => {
      await reserveTickets(testTicketTypeId, 2);

      const { data } = await client
        .from('ticket_types')
        .select('quantity_sold')
        .eq('id', testTicketTypeId)
        .single();

      expect(data?.quantity_sold).toBe(2);
    });

    it('should handle concurrent reservations atomically', async () => {
      // Simulate 3 concurrent requests, each trying to reserve 4 tickets (total 12, but only 10 available)
      const reservationPromises = [
        reserveTickets(testTicketTypeId, 4),
        reserveTickets(testTicketTypeId, 4),
        reserveTickets(testTicketTypeId, 4),
      ];

      const results = await Promise.all(reservationPromises);

      // Count successful reservations
      const successCount = results.filter((r) => r.success).length;

      // Due to atomic RPC, max 2 should succeed (8 tickets), third should fail
      expect(successCount).toBeLessThanOrEqual(2);

      // Verify total quantity_sold doesn't exceed total
      const { data } = await client
        .from('ticket_types')
        .select('quantity_sold, quantity_total')
        .eq('id', testTicketTypeId)
        .single();

      expect(data!.quantity_sold).toBeLessThanOrEqual(data!.quantity_total);
    });
  });

  describe('releaseTickets', () => {
    beforeEach(async () => {
      // Reserve 5 tickets before each test
      await reserveTickets(testTicketTypeId, 5);
    });

    it('should successfully release reserved tickets', async () => {
      const result = await releaseTickets(testTicketTypeId, 2);

      expect(result.success).toBe(true);
      expect(result.new_quantity_sold).toBe(3);
      expect(result.error_message).toBeNull();
    });

    it('should atomically decrement quantity_sold', async () => {
      await releaseTickets(testTicketTypeId, 2);

      const { data } = await client
        .from('ticket_types')
        .select('quantity_sold')
        .eq('id', testTicketTypeId)
        .single();

      expect(data?.quantity_sold).toBe(3);
    });

    it('should not go below 0', async () => {
      // Try to release more than was sold
      await releaseTickets(testTicketTypeId, 10);

      const { data } = await client
        .from('ticket_types')
        .select('quantity_sold')
        .eq('id', testTicketTypeId)
        .single();

      expect(data?.quantity_sold).toBeGreaterThanOrEqual(0);
    });

    it('should handle partial release on payment failure', async () => {
      // Simulate: reserve 5, payment fails, release 3, then retry with 2
      await releaseTickets(testTicketTypeId, 3);

      let { data } = await client
        .from('ticket_types')
        .select('quantity_sold')
        .eq('id', testTicketTypeId)
        .single();

      expect(data?.quantity_sold).toBe(2);

      // Now retry with remaining 2
      const result = await releaseTickets(testTicketTypeId, 2);
      expect(result.success).toBe(true);

      ({ data } = await client
        .from('ticket_types')
        .select('quantity_sold')
        .eq('id', testTicketTypeId)
        .single());

      expect(data?.quantity_sold).toBe(0);
    });
  });

  describe('Concurrent Reservation + Release', () => {
    it('should prevent overselling with concurrent operations', async () => {
      // Start 5 concurrent reservations of 3 tickets each (total 15, only 10 available)
      const promises = [];

      for (let i = 0; i < 5; i++) {
        promises.push(reserveTickets(testTicketTypeId, 3));
      }

      const results = await Promise.all(promises);
      const totalReserved = results
        .filter((r) => r.success)
        .reduce((sum, r) => sum + 3, 0);

      // Total reserved should not exceed capacity
      expect(totalReserved).toBeLessThanOrEqual(10);

      // Verify in database
      const { data } = await client
        .from('ticket_types')
        .select('quantity_sold, quantity_total')
        .eq('id', testTicketTypeId)
        .single();

      expect(data!.quantity_sold).toBeLessThanOrEqual(data!.quantity_total);
    });

    it('should correctly handle reserve -> release -> reserve flow', async () => {
      // 1. Reserve 7
      const res1 = await reserveTickets(testTicketTypeId, 7);
      expect(res1.success).toBe(true);

      // 2. Release 4
      const rel1 = await releaseTickets(testTicketTypeId, 4);
      expect(rel1.success).toBe(true);

      // 3. Verify we have 7 available again
      let { data } = await client
        .from('ticket_types')
        .select('quantity_sold')
        .eq('id', testTicketTypeId)
        .single();

      expect(data?.quantity_sold).toBe(3);

      // 4. Try to reserve 8 more (should fail, only 7 available)
      const res2 = await reserveTickets(testTicketTypeId, 8);
      expect(res2.success).toBe(false);

      // 5. Reserve 7 (should succeed)
      const res3 = await reserveTickets(testTicketTypeId, 7);
      expect(res3.success).toBe(true);

      ({ data } = await client
        .from('ticket_types')
        .select('quantity_sold')
        .eq('id', testTicketTypeId)
        .single());

      expect(data?.quantity_sold).toBe(10);
    });
  });
});
