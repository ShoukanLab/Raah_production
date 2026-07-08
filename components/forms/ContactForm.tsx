'use client';

import { useState } from 'react';

interface FormFields {
  firstName: string;
  lastName: string;
  email: string;
  inquiryType: string;
  message: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  inquiryType?: string;
  message?: string;
}

export function ContactForm() {
  const [fields, setFields] = useState<FormFields>({
    firstName: '',
    lastName: '',
    email: '',
    inquiryType: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!fields.firstName.trim()) {
      newErrors.firstName = 'First name is required.';
    }

    if (!fields.lastName.trim()) {
      newErrors.lastName = 'Last name is required.';
    }

    if (!fields.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      newErrors.email = 'Invalid email address.';
    }

    if (!fields.inquiryType) {
      newErrors.inquiryType = 'Please select an inquiry type.';
    }

    if (!fields.message.trim()) {
      newErrors.message = 'Message is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      setServerError('Please fill in all required fields before submitting.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setServerError(data.error || 'Failed to send message. Please try again.');
        return;
      }

      setSubmitted(true);
    } catch {
      setServerError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFields((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <p className="font-playfair text-2xl text-champagne mb-3">Message Sent</p>
        <p className="font-montserrat text-sm text-champagne/60">
          We&apos;ll be in touch within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {serverError && (
        <div className="bg-red-900/20 border border-red-600/40 rounded-sm px-4 py-3">
          <p className="text-red-400 text-sm font-montserrat">{serverError}</p>
        </div>
      )}

      <div className="flex gap-2.5">
        <div className="flex-1">
          <label htmlFor="firstName" className="block font-montserrat text-[9px] font-bold uppercase tracking-[0.18em] text-t4 mb-2">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={fields.firstName}
            onChange={handleFieldChange}
            placeholder="Alex"
            className="input-dark"
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
          />
          {errors.firstName && (
            <p id="firstName-error" className="text-red-400 text-xs font-montserrat mt-1">
              {errors.firstName}
            </p>
          )}
        </div>

        <div className="flex-1">
          <label htmlFor="lastName" className="block font-montserrat text-[9px] font-bold uppercase tracking-[0.18em] text-t4 mb-2">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={fields.lastName}
            onChange={handleFieldChange}
            placeholder="Smith"
            className="input-dark"
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
          />
          {errors.lastName && (
            <p id="lastName-error" className="text-red-400 text-xs font-montserrat mt-1">
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block font-montserrat text-[9px] font-bold uppercase tracking-[0.18em] text-t4 mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={fields.email}
          onChange={handleFieldChange}
          placeholder="alex@email.com"
          className="input-dark"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-red-400 text-xs font-montserrat mt-1">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="inquiryType" className="block font-montserrat text-[9px] font-bold uppercase tracking-[0.18em] text-t4 mb-2">
          Inquiry Type
        </label>
        <select
          id="inquiryType"
          name="inquiryType"
          value={fields.inquiryType}
          onChange={handleFieldChange}
          className="input-dark"
          aria-invalid={!!errors.inquiryType}
          aria-describedby={errors.inquiryType ? 'inquiryType-error' : undefined}
        >
          <option value="">Select an inquiry type...</option>
          <option value="Show / Ticket Inquiry">Show / Ticket Inquiry</option>
          <option value="Book Production Services">Book Production Services</option>
          <option value="Press & Media">Press & Media</option>
          <option value="General Question">General Question</option>
        </select>
        {errors.inquiryType && (
          <p id="inquiryType-error" className="text-red-400 text-xs font-montserrat mt-1">
            {errors.inquiryType}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block font-montserrat text-[9px] font-bold uppercase tracking-[0.18em] text-t4 mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={fields.message}
          onChange={handleFieldChange}
          placeholder="Tell us about your event or question..."
          rows={5}
          className="input-dark resize-none"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <p id="message-error" className="text-red-400 text-xs font-montserrat mt-1">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-gold-filled w-full py-4 font-montserrat text-sm tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
