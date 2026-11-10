import React, { useState, useEffect } from 'react';
import { Language } from '../types/portfolio';
import { PERSONAL_INFO } from '../data/portfolioData';
import { t } from '../data/translations';
import confetti from 'canvas-confetti';
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Send,
  CheckCircle2
} from 'lucide-react';

interface ContactProps {
  lang: Language;
  prefilledSubject?: string;
}

export const Contact: React.FC<ContactProps> = ({ lang, prefilledSubject = '' }) => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(prefilledSubject);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasSubmitError, setHasSubmitError] = useState(false);

  useEffect(() => {
    if (prefilledSubject) {
      setSubject(prefilledSubject);
      const target = document.getElementById('contact');
      target?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [prefilledSubject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;

    setIsSubmitting(true);
    setIsSuccess(false);
    setHasSubmitError(false);

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${PERSONAL_INFO.email}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          _replyto: email,
          _subject: subject.trim() || 'New portfolio contact message',
          subject: subject.trim(),
          message
        })
      });
      const result: { success?: boolean | string } = await response.json();

      if (!response.ok || !['true', true].includes(result.success ?? false)) {
        throw new Error('The contact form provider rejected the submission.');
      }

      setIsSuccess(true);
      setEmail('');
      setSubject('');
      setMessage('');

      // Confetti burst with palette colors
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#F8DD1B', '#F5CE0D', '#DDAC0D', '#ffffff']
        });
      } catch {
        // Silently handle if blocked
      }
    } catch (error) {
      console.error('Contact form submission failed:', error);
      setHasSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 space-y-12 relative">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#F8DD1B]">
          {t('Get In Touch', lang)}
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white">
          <span>{t('Contact', lang)} </span>
          <span className="text-[#F5CE0D] text-glow-subtle">
            {t('Me!', lang)}
          </span>
        </h2>
      </div>

      <div className="rounded-3xl bg-[#181c22] border border-[#2E3137] p-8 md:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Direct Communication Channels */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">
              {t("Let's Work Together", lang)}
            </h3>
            <p className="text-[#86898B] text-sm leading-relaxed">
              {t(
                "Have a project in mind or want to scale your business? Send a message and let's get started.",
                lang
              )}
            </p>
          </div>

          <div className="space-y-4">
            {/* Email Card */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#121519] border border-[#2E3137] hover:border-[#F8DD1B]/60 transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#F5CE0D]/15 text-[#F8DD1B] flex items-center justify-center text-lg shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[#86898B] font-semibold">
                  {t('Email', lang)}
                </p>
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="text-sm font-bold text-white hover:text-[#F8DD1B] transition break-all"
                >
                  {PERSONAL_INFO.email}
                </a>
              </div>
            </div>

            {/* Phone / WhatsApp Card */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#121519] border border-[#2E3137] hover:border-[#F8DD1B]/60 transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#F5CE0D]/15 text-[#F8DD1B] flex items-center justify-center text-lg shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[#86898B] font-semibold">
                  {t('Phone / WhatsApp', lang)}
                </p>
                <a
                  href={PERSONAL_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-white hover:text-[#F8DD1B] transition"
                >
                  {PERSONAL_INFO.phone}
                </a>
              </div>
            </div>

            {/* Location Card */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#121519] border border-[#2E3137] hover:border-[#F8DD1B]/60 transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#F5CE0D]/15 text-[#F8DD1B] flex items-center justify-center text-lg shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[#86898B] font-semibold">
                  {t('Location', lang)}
                </p>
                <p className="text-sm font-bold text-white">
                  {t(PERSONAL_INFO.locationKey, lang)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#86898B] pt-2">
            <ShieldCheck className="w-4 h-4 text-[#F8DD1B]" />
            <span>
              {t('Fast response time guaranteed within 24 hours', lang)}
            </span>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <form id="contact-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label
                htmlFor="contact-email"
                className="text-xs font-bold text-gray-300 uppercase tracking-wider block"
              >
                {t('Email Address', lang)}
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@example.com"
                className="w-full bg-[#121519] border border-[#2E3137] rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#F8DD1B] focus:ring-1 focus:ring-[#F8DD1B] transition text-sm"
              />
            </div>

            {/* Project / Service Context (Optional) */}
            <div className="space-y-2">
              <label
                htmlFor="contact-subject"
                className="text-xs font-bold text-gray-300 uppercase tracking-wider block"
              >
                Subject / Project Interest
              </label>
              <input
                id="contact-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. E-Commerce Store or Meta Ads Scaling"
                className="w-full bg-[#121519] border border-[#2E3137] rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#F8DD1B] focus:ring-1 focus:ring-[#F8DD1B] transition text-sm"
              />
            </div>

            {/* Message Textarea */}
            <div className="space-y-2">
              <label
                htmlFor="contact-message"
                className="text-xs font-bold text-gray-300 uppercase tracking-wider block"
              >
                {t('Your Message', lang)}
              </label>
              <textarea
                id="contact-message"
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t(
                  'Tell me about your project, target audience, or campaign goals...',
                  lang
                )}
                className="w-full bg-[#121519] border border-[#2E3137] rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#F8DD1B] focus:ring-1 focus:ring-[#F8DD1B] transition text-sm resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full bg-[#F5CE0D] hover:bg-[#F8DD1B] disabled:opacity-50 text-black font-extrabold text-sm uppercase tracking-wider transition shadow-[0_0_25px_rgba(245,206,13,0.45)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <span id="btn-text">
                {isSubmitting ? t('Sending...', lang) : t('Send Message', lang)}
              </span>
              <Send className="w-4 h-4 rtl:rotate-180" />
            </button>

            {/* Success Feedback Banner */}
            {isSuccess && (
              <div className="flex items-center gap-2 justify-center p-3 rounded-xl bg-[#F5CE0D]/15 border border-[#F8DD1B]/40 text-[#F8DD1B] text-sm font-semibold animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {t('Thank you! Your message has been sent successfully.', lang)}
                </span>
              </div>
            )}
            {hasSubmitError && (
              <div role="alert" className="text-center p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm font-semibold">
                {t('Unable to send your message. Please try again.', lang)}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};
