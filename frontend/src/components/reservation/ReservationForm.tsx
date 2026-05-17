'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { api, ReservationInput } from '@/lib/api';
import { getMinDate } from '@/lib/utils';
import { BRAND } from '@/lib/brand';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const timeSlots = [
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00',
];

export default function ReservationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<ReservationInput>({
    customerName: '',
    phone: '',
    email: '',
    date: '',
    time: '20:00',
    guests: 2,
    seatingPreference: 'Indoor',
    specialRequest: '',
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customerName.trim()) e.customerName = 'Name is required';
    if (!form.phone.match(/^[\d\s+\-()]{7,20}$/)) e.phone = 'Valid phone number required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (!form.date) e.date = 'Date is required';
    else if (form.date < getMinDate()) e.date = 'Cannot book past dates';
    if (!form.time) e.time = 'Time is required';
    if (form.guests < 1 || form.guests > 50) e.guests = 'Guests must be 1-50';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await api.createReservation({
        ...form,
        date: new Date(form.date).toISOString(),
      });
      sessionStorage.setItem(BRAND.confirmKey, JSON.stringify(res.data));
      router.push('/confirmation');
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Booking failed' });
    } finally {
      setLoading(false);
    }
  };

  const update = (field: keyof ReservationInput, value: string | number) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '', submit: '' }));
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="surface-elevated rounded-lg p-8 md:p-10"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Full Name" error={errors.customerName}>
          <input
            className="input-field"
            value={form.customerName}
            onChange={(e) => update('customerName', e.target.value)}
            placeholder="John Doe"
          />
        </Field>
        <Field label="Phone Number" error={errors.phone}>
          <input
            className="input-field"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="+1 (555) 000-0000"
          />
        </Field>
        <Field label="Email" error={errors.email} className="md:col-span-2">
          <input
            type="email"
            className="input-field"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="you@email.com"
          />
        </Field>
        <Field label="Date" error={errors.date}>
          <input
            type="date"
            className="input-field"
            min={getMinDate()}
            value={form.date}
            onChange={(e) => update('date', e.target.value)}
          />
        </Field>
        <Field label="Time" error={errors.time}>
          <select
            className="input-field"
            value={form.time}
            onChange={(e) => update('time', e.target.value)}
          >
            {timeSlots.map((t) => (
              <option key={t} value={t} className="bg-charcoal">
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Number of Guests" error={errors.guests}>
          <input
            type="number"
            min={1}
            max={50}
            className="input-field"
            value={form.guests}
            onChange={(e) => update('guests', parseInt(e.target.value, 10) || 1)}
          />
        </Field>
        <Field label="Seating Preference">
          <div className="flex gap-4">
            {(['Indoor', 'Outdoor'] as const).map((opt) => (
              <label
                key={opt}
                className={`flex flex-1 cursor-pointer items-center justify-center rounded-md border px-4 py-3 text-sm transition-colors ${
                  form.seatingPreference === opt
                    ? 'border-gold/40 bg-gold/10 text-gold'
                    : 'border-border text-cream-muted hover:border-cream/20'
                }`}
              >
                <input
                  type="radio"
                  name="seating"
                  className="sr-only"
                  checked={form.seatingPreference === opt}
                  onChange={() => update('seatingPreference', opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        </Field>
        <Field label="Special Request" className="md:col-span-2">
          <textarea
            className="input-field min-h-[100px] resize-none"
            value={form.specialRequest}
            onChange={(e) => update('specialRequest', e.target.value)}
            placeholder="Allergies, celebrations, seating requests..."
          />
        </Field>
      </div>

      {errors.submit && (
        <p className="mt-4 text-center text-sm text-red-400">{errors.submit}</p>
      )}

      <div className="mt-8 flex justify-center">
        <Button type="submit" disabled={loading} className="w-full sm:w-auto sm:min-w-[200px]">
          {loading ? <LoadingSpinner size="sm" /> : 'Submit Reservation'}
        </Button>
      </div>
    </motion.form>
  );
}

function Field({
  label,
  error,
  children,
  className = '',
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
