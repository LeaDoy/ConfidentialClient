/**
 * Example React feedback form (React 18+).
 * Wire ValidatorFeedback from your bundler:
 *   import { ValidatorFeedback, ValidatorFeedbackError } from '@pdlc/validator-feedback';
 */

import { useState } from 'react';
import { ValidatorFeedback, ValidatorFeedbackError } from '../src/index.js';

export function FeedbackForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banner, setBanner] = useState({ tone: null, text: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBanner({ tone: null, text: '' });
    setIsSubmitting(true);

    const form = event.currentTarget;
    const data = new FormData(form);
    const description = String(data.get('description') ?? '');
    const type = String(data.get('type') ?? 'bug');
    const priority = String(data.get('priority') ?? 'medium');
    const email = String(data.get('email') ?? '');

    try {
      const result = await ValidatorFeedback.submit({
        description,
        type,
        priority,
        email: email || undefined,
      });
      setBanner({ tone: 'success', text: result.message });
      form.reset();
    } catch (err) {
      const message =
        err instanceof ValidatorFeedbackError
          ? err.message
          : 'Something unexpected happened. Please try again in a moment.';
      setBanner({ tone: 'error', text: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section aria-labelledby="feedback-heading">
      <h2 id="feedback-heading">Send feedback</h2>
      {banner.tone === 'success' && (
        <p role="status" style={{ color: 'var(--vf-ok, #0a7)' }}>
          {banner.text}
        </p>
      )}
      {banner.tone === 'error' && (
        <p role="alert" style={{ color: 'var(--vf-err, #b00)' }}>
          {banner.text}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="vf-description">What happened?</label>
        <textarea
          id="vf-description"
          name="description"
          required
          minLength={3}
          rows={5}
          placeholder="Describe the issue, idea, or performance problem…"
        />
        <label htmlFor="vf-type">Type</label>
        <select id="vf-type" name="type" defaultValue="bug">
          <option value="bug">Bug report</option>
          <option value="feature_request">Feature request</option>
          <option value="performance">Performance</option>
          <option value="other">Other</option>
        </select>
        <label htmlFor="vf-priority">Priority</label>
        <select id="vf-priority" name="priority" defaultValue="medium">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <label htmlFor="vf-email">Email (optional)</label>
        <input
          id="vf-email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Submit feedback'}
        </button>
      </form>
    </section>
  );
}
