import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { elementorForm } from '../content/site.js';
import { ButtonInner, buttonBase } from './Button.jsx';

// The original Elementor Pro form, posted to the same WordPress handler with the same field names
// and hidden fields as the live widget. WordPress sends no CORS headers, so the request is sent
// "no-cors": it is delivered, but the response body cannot be read from another origin.
export default function ContactForm({ postId, formId, refererTitle, queriedId }) {
  const [status, setStatus] = useState('idle');

  async function onSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    data.append('action', elementorForm.action);
    data.append('referrer', window.location.href);
    setStatus('sending');
    try {
      await fetch(elementorForm.ajaxUrl, { method: 'POST', body: data, mode: 'no-cors', credentials: 'omit' });
      setStatus('success');
      e.target.reset();
    } catch {
      setStatus('error');
    }
  }

  const field =
    'w-full rounded-xl border border-line bg-surface-page px-5 py-4 text-base text-ink placeholder:text-ink/45 transition-[border-color,box-shadow,background-color] duration-300 hover:border-brand-navy/30 focus:border-brand-cyan focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-cyan/15';

  return (
    <form
      method="post"
      name={elementorForm.name}
      onSubmit={onSubmit}
      className="rounded-[22px] border border-line/70 bg-white p-6 shadow-[0_30px_80px_-40px_rgba(0,33,64,0.35)] md:p-10"
    >
      <input type="hidden" name="post_id" value={postId} />
      <input type="hidden" name="form_id" value={formId} />
      <input type="hidden" name="referer_title" value={refererTitle} />
      <input type="hidden" name="queried_id" value={queriedId} />

      <div className="space-y-4">
        {elementorForm.fields.map((f) =>
          f.type === 'textarea' ? (
            <textarea key={f.name} id={f.id} name={f.name} placeholder={f.placeholder} required={f.required} rows={5} className={`${field} resize-y`} />
          ) : (
            <input key={f.name} id={f.id} name={f.name} type={f.type} placeholder={f.placeholder} required={f.required} className={field} />
          )
        )}
      </div>

      <button type="submit" disabled={status === 'sending'} className={`${buttonBase} mt-6 w-full justify-between bg-brand-cyan-form text-white hover:shadow-[0_12px_30px_-10px_rgba(48,176,237,0.7)]`}>
        <ButtonInner label={elementorForm.submitLabel} variant="cyan" />
      </button>

      <div role="status" aria-live="polite">
        <AnimatePresence>
          {(status === 'success' || status === 'error') && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-5 rounded-xl px-5 py-4 text-sm font-semibold ${status === 'success' ? 'bg-brand-cyan/10 text-brand-navy' : 'border border-line-strong/30 bg-surface-gray text-ink'}`}
            >
              {elementorForm.messages[status]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
