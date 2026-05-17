'use client';

import { motion } from 'framer-motion';

const quotes = [
  {
    text: 'The reservation flow is effortless, and the team always remembers our seating preference. It feels like a hotel concierge, not a booking widget.',
    author: 'Sarah M.',
    role: 'Regular guest',
  },
  {
    text: 'We host client dinners here monthly. The atmosphere is polished without being stiff — exactly what we need for hospitality-led brands.',
    author: 'James K.',
    role: 'Creative director',
  },
  {
    text: 'Saturday sessions are a staple for our team. Consistent quality, thoughtful programming, and service that anticipates.',
    author: 'Elena R.',
    role: 'Member since 2022',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section-padding border-t border-border">
      <div className="mx-auto max-w-7xl">
        <p className="section-label">Guest voices</p>
        <h2 className="heading-lg mt-3 max-w-lg">Trusted by people who care about the details</h2>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {quotes.map((q, i) => (
            <motion.blockquote
              key={q.author}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="surface-card p-8"
            >
              <p className="text-body leading-relaxed">&ldquo;{q.text}&rdquo;</p>
              <footer className="mt-6 border-t border-border pt-4">
                <p className="text-sm font-medium text-cream">{q.author}</p>
                <p className="text-xs text-slate mt-0.5">{q.role}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
