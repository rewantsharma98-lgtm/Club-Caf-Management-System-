'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, PortalProfile } from '@/lib/api';
import { getPortalToken } from '@/lib/portalAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';

export default function PortalProfilePage() {
  const [profile, setProfile] = useState<PortalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const token = getPortalToken();
    if (!token) return;
    api.portalGetProfile(token).then((r) => setProfile(r.data)).finally(() => setLoading(false));
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getPortalToken();
    if (!token || !profile) return;
    setSaving(true);
    setMsg('');
    try {
      const res = await api.portalUpdateProfile(token, profile);
      setProfile(res.data);
      setMsg('Profile updated successfully');
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <motion.div className="flex justify-center py-20">
        <LoadingSpinner />
      </motion.div>
    );
  }

  if (!profile) return null;

  const drinks = profile.preferences?.favoriteDrinks?.join(', ') || '';

  return (
    <motion.div className="space-y-8 max-w-2xl mx-auto">
      <h1 className="heading-lg">Your Profile</h1>
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={save}
        className="glass-strong rounded-3xl p-8 space-y-5"
      >
        <motion.div>
          <label className="text-sm text-cream-muted">Full Name</label>
          <input
            className="input-field mt-1"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </motion.div>
        <motion.div>
          <label className="text-sm text-cream-muted">Phone</label>
          <input
            className="input-field mt-1"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          />
        </motion.div>
        <motion.div>
          <label className="text-sm text-cream-muted">Email</label>
          <input className="input-field mt-1 opacity-60" value={profile.email} disabled />
        </motion.div>
        <motion.div>
          <label className="text-sm text-cream-muted">Birthday (unlock birthday rewards)</label>
          <input
            type="date"
            className="input-field mt-1"
            value={profile.birthday ? profile.birthday.split('T')[0] : ''}
            onChange={(e) => setProfile({ ...profile, birthday: e.target.value })}
          />
        </motion.div>
        <motion.div>
          <label className="text-sm text-cream-muted">Seating Preference</label>
          <select
            className="input-field mt-1"
            value={profile.preferences?.seatingPreference || ''}
            onChange={(e) =>
              setProfile({
                ...profile,
                preferences: { ...profile.preferences, seatingPreference: e.target.value },
              })
            }
          >
            <option value="">No preference</option>
            <option value="Indoor">Indoor</option>
            <option value="Outdoor">Outdoor</option>
          </select>
        </motion.div>
        <motion.div>
          <label className="text-sm text-cream-muted">Favorite Drinks (comma separated)</label>
          <input
            className="input-field mt-1"
            value={drinks}
            onChange={(e) =>
              setProfile({
                ...profile,
                preferences: {
                  ...profile.preferences,
                  favoriteDrinks: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                },
              })
            }
          />
        </motion.div>
        <motion.div>
          <label className="text-sm text-cream-muted">Dietary Notes</label>
          <textarea
            className="input-field mt-1 min-h-[80px]"
            value={profile.preferences?.dietaryNotes || ''}
            onChange={(e) =>
              setProfile({
                ...profile,
                preferences: { ...profile.preferences, dietaryNotes: e.target.value },
              })
            }
          />
        </motion.div>
        {msg && <p className="text-sm text-cyan text-center">{msg}</p>}
        <Button type="submit" disabled={saving} className="w-full">
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </motion.form>
    </motion.div>
  );
}
