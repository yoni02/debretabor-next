import type { Metadata } from 'next';
import AnimationsInit from '@/components/AnimationsInit';

export const metadata: Metadata = { title: 'FAQ' };

const FAQS = [
  { q: 'What time are services?', a: 'Our main service is Sunday at 6:00 AM. Check our Services page for the full schedule.' },
  { q: "Can I visit if I'm not Orthodox?", a: 'Yes! All are welcome to attend and participate in worship.' },
  { q: 'What should I wear?', a: 'We ask that visitors dress modestly and reverently out of respect for the sacred space.' },
  { q: 'How do I get involved?', a: 'Visit our Ministries page to learn about different ways to serve, or speak with us after service.' },
];

export default function FaqPage() {
  return (
    <>
      <AnimationsInit />
      <div className="page-header">
        <h1>Frequently Asked Questions</h1>
        <p>Common questions about visiting our church</p>
      </div>
      {FAQS.map((faq, i) => (
        <div className="faq-item" key={i}>
          <div className="faq-question">{faq.q}</div>
          <div className="faq-answer">{faq.a}</div>
        </div>
      ))}
    </>
  );
}
