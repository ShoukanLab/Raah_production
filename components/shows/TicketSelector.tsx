'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { TicketTypeWithAvailability } from '@/lib/supabase/inventory';

interface TicketSelectorProps {
  ticketTypes: TicketTypeWithAvailability[];
  showSlug: string;
}

export function TicketSelector({ ticketTypes, showSlug }: TicketSelectorProps) {
  const [selectedTypeId, setSelectedTypeId] = useState<string>(ticketTypes[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedType = ticketTypes.find((t) => t.id === selectedTypeId);
  const maxQuantity = selectedType?.available_quantity || 0;
  const isAvailable = maxQuantity > 0;
  const totalPrice = selectedType ? (selectedType.price as number) * quantity : 0;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= Math.min(maxQuantity, 10)) {
      setQuantity(newQuantity);
      setError(null);
    }
  };

  const handleReserveTickets = async () => {
    if (!selectedTypeId || !isAvailable) {
      setError('Please select an available ticket type');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketTypeId: selectedTypeId,
          quantity,
          showSlug,
        }),
      });

      const data = await response.json() as { success: boolean; data?: { url: string }; error?: string };

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to create checkout session');
        return;
      }

      if (data.data?.url) {
        window.location.href = data.data.url;
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (ticketTypes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-champagne/60 font-montserrat text-sm">No tickets available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Ticket Type Selector */}
      {ticketTypes.length > 1 && (
        <div>
          <label className="block text-xs font-montserrat font-semibold uppercase tracking-widest text-t4 mb-3">
            Ticket Type
          </label>
          <div className="space-y-2">
            {ticketTypes.map((type) => {
              const available = type.available_quantity > 0;
              return (
                <button
                  key={type.id}
                  onClick={() => {
                    setSelectedTypeId(type.id);
                    setQuantity(1);
                    setError(null);
                  }}
                  className={`w-full px-4 py-3 rounded-sm border text-left transition-colors ${
                    selectedTypeId === type.id
                      ? 'border-gold bg-gold/10'
                      : 'border-charcoal hover:border-gold/50'
                  } ${!available ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-montserrat text-sm text-white">{type.name}</p>
                      <p className="font-montserrat text-xs text-t2">
                        {type.available_quantity} of {type.quantity_total} available
                      </p>
                    </div>
                    <p className="font-playfair text-lg text-gold">
                      ${((type.price as number) / 100).toFixed(2)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      {isAvailable && (
        <div>
          <label className="block text-xs font-montserrat font-semibold uppercase tracking-widest text-t4 mb-3">
            Quantity
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="w-10 h-10 flex items-center justify-center border border-charcoal hover:border-gold/50 rounded-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              −
            </button>
            <span className="flex-1 text-center font-montserrat text-lg">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= Math.min(maxQuantity, 10)}
              className="w-10 h-10 flex items-center justify-center border border-charcoal hover:border-gold/50 rounded-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Price Display */}
      {isAvailable && (
        <div className="space-y-1 py-4 border-t border-charcoal">
          <div className="flex justify-between text-sm font-montserrat text-t2">
            <span>Per Ticket</span>
            <span>${(selectedType?.price as number).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-playfair text-xl text-gold">
            <span>Total</span>
            <span>${(totalPrice).toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-600/40 rounded-sm px-4 py-3">
          <p className="text-red-400 text-sm font-montserrat">{error}</p>
        </div>
      )}

      {/* Reserve Button */}
      <Button
        variant="primary"
        fullWidth
        onClick={handleReserveTickets}
        disabled={!isAvailable || loading}
      >
        {loading ? 'Processing...' : 'Reserve Tickets'}
      </Button>
    </div>
  );
}
