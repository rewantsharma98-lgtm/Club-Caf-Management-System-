'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SafeImage from '@/components/ui/SafeImage';
import { Calendar, ArrowUpRight } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { api, EventItem } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { useHomeUI } from '@/context/HomeUIContext';
import { FALLBACK_EVENTS } from '@/lib/media';

function getFallbackEvents(): EventItem[] {
  return FALLBACK_EVENTS as EventItem[];
}

export default function EventsSection() {
  const { openReserve } = useHomeUI();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getEvents()
      .then((res) => setEvents(res.data.length ? res.data : getFallbackEvents()))
      .catch(() => setEvents(getFallbackEvents()))
      .finally(() => setLoading(false));
  }, []);

  const hero = events[0];
  const rest = events.slice(1, 3);

  return (
    <section id="events" className="section-padding border-t border-border">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <p className="section-label">What&apos;s on</p>
            <h2 className="heading-lg mt-3">Upcoming events</h2>
          </div>
          <button
            type="button"
            onClick={openReserve}
            className="flex min-h-[44px] items-center gap-1 text-sm text-gold transition-colors hover:text-cream w-fit"
          >
            Reserve for an event <ArrowUpRight size={14} />
          </button>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        )}

        {!loading && hero && (
          <div className="space-y-6">
            <motion.article
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-lg aspect-[4/3] min-h-[220px] surface-card sm:aspect-[21/9] sm:min-h-[260px] md:min-h-[280px]"
            >
              <SafeImage
                src={hero.image}
                alt={hero.title}
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-10">
                <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold mb-3">
                  <Calendar size={12} />
                  {formatDate(hero.date)}
                </p>
                <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-cream max-w-2xl">{hero.title}</h3>
                <p className="mt-3 text-body max-w-xl line-clamp-2">{hero.description}</p>
                <button type="button" onClick={openReserve} className="mt-6 btn-outline text-sm">
                  Get on the list
                </button>
              </div>
            </motion.article>

            {rest.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2">
                {rest.map((event, i) => (
                  <motion.article
                    key={event._id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="group flex flex-col overflow-hidden rounded-lg surface-card sm:flex-row"
                  >
                    <div className="relative aspect-[16/10] w-full shrink-0 sm:aspect-auto sm:w-2/5 sm:min-h-[200px]">
                      <SafeImage
                        src={event.image}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6 flex flex-col justify-center">
                      <p className="text-xs text-gold uppercase tracking-wider flex items-center gap-1">
                        <Calendar size={11} /> {formatDate(event.date)}
                      </p>
                      <h3 className="font-display text-xl text-cream mt-2">{event.title}</h3>
                      <p className="text-sm text-body mt-2 line-clamp-2">{event.description}</p>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}