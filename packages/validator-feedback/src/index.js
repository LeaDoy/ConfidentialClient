/**
 * Software Factory — Validator Feedback client
 * PDLC-Cohort2-Doyle
 */

export const DEFAULT_APP_KEY = 'sf-int-FCxprMp3vKrpW4NSOx7irYVuTkExrr5F';
export const DEFAULT_ENDPOINT =
  'https://api.factory.8090.dev/v1/integration/validator/feedback';

const FEEDBACK_TYPES = new Set(['bug', 'feature_request', 'performance', 'other']);
const PRIORITIES = new Set(['low', 'medium', 'high']);
const MAX_DESCRIPTION_LENGTH = 20000;

export class ValidatorFeedbackError extends Error {
  /**
   * @param {string} message - User-facing or diagnostic message
   * @param {{ status?: number, code?: string, body?: unknown }} [meta]
   */
  constructor(message, meta = {}) {
    super(message);
    this.name = 'ValidatorFeedbackError';
    this.status = meta.status;
    this.code = meta.code;
    this.body = meta.body;
  }
}

/**
 * Reduce a URL or path to a relative path only (no scheme/host/query/hash).
 * Never forwards full URLs to the API.
 * @param {string} pathOrUrl
 * @returns {string}
 */
export function sanitizeRelativePath(pathOrUrl) {
  const raw = String(pathOrUrl ?? '').trim();
  if (!raw) return '/';

  try {
    if (/^https?:\/\//i.test(raw)) {
      const u = new URL(raw);
      return u.pathname || '/';
    }
  } catch {
    // treat as non-absolute
  }

  const noQueryHash = raw.split('?')[0].split('#')[0];
  const withSlash = noQueryHash.startsWith('/') ? noQueryHash : `/${noQueryHash}`;
  return withSlash.replace(/\/{2,}/g, '/') || '/';
}

/**
 * @param {{ route?: string | null }} [overrides]
 * @returns {{ route: string | null, user_agent: string, timestamp: string }}
 */
export function getAutomaticContext(overrides = {}) {
  const timestamp = new Date().toISOString();
  const user_agent =
    typeof navigator !== 'undefined' && navigator.userAgent ? navigator.userAgent : '';

  let route = overrides.route;
  if (
    (route === undefined || route === null || route === '') &&
    typeof window !== 'undefined' &&
    window.location
  ) {
    route = window.location.pathname || '/';
  }
  if (typeof route === 'string' && route.length > 0) {
    route = sanitizeRelativePath(route);
  } else {
    route = null;
  }

  return { route, user_agent, timestamp };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @param {Record<string, unknown>} feedback
 * @returns {{
 *   description: string,
 *   feedback_type: string,
 *   priority: string,
 *   user_email: string | null
 * }}
 */
export function validateFeedbackInput(feedback) {
  if (!feedback || typeof feedback !== 'object') {
    throw new ValidatorFeedbackError('Feedback must be an object.');
  }

  const rawDesc = feedback.description;
  if (rawDesc == null || String(rawDesc).trim().length === 0) {
    throw new ValidatorFeedbackError('Please enter a short description of the issue or idea.');
  }

  const description = String(rawDesc).trim();
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    throw new ValidatorFeedbackError(
      `Description is too long (max ${MAX_DESCRIPTION_LENGTH} characters).`,
    );
  }

  const feedback_type = String(
    feedback.feedback_type ?? feedback.type ?? 'bug',
  );
  if (!FEEDBACK_TYPES.has(feedback_type)) {
    throw new ValidatorFeedbackError('Please choose a valid feedback type.');
  }

  const priority = String(feedback.priority ?? 'medium');
  if (!PRIORITIES.has(priority)) {
    throw new ValidatorFeedbackError('Please choose a valid priority.');
  }

  let user_email = feedback.user_email ?? feedback.email ?? null;
  if (user_email != null) {
    user_email = String(user_email).trim();
    if (user_email.length === 0) {
      user_email = null;
    } else if (!EMAIL_RE.test(user_email)) {
      throw new ValidatorFeedbackError('Please enter a valid email address or leave it blank.');
    }
  }

  return { description, feedback_type, priority, user_email };
}

/**
 * @param {string} baseDescription
 * @param {{ route: string | null, user_agent: string, timestamp: string }} ctx
 */
function appendContextBlock(baseDescription, ctx) {
  const block = [
    '[validator-context]',
    `path: ${ctx.route ?? '(unknown)'}`,
    `user_agent: ${ctx.user_agent || '(none)'}`,
    `ts: ${ctx.timestamp}`,
    '[/validator-context]',
  ].join('\n');
  return `${baseDescription}\n\n${block}`;
}

function getFetch(fetchImpl) {
  if (fetchImpl) return fetchImpl;
  if (typeof globalThis !== 'undefined' && typeof globalThis.fetch === 'function') {
    return globalThis.fetch.bind(globalThis);
  }
  return null;
}

/**
 * @param {{
 *   appKey?: string,
 *   endpoint?: string,
 *   fetch?: typeof fetch
 * }} [options]
 */
export function createValidatorFeedbackClient(options = {}) {
  const appKey = options.appKey ?? DEFAULT_APP_KEY;
  const endpoint = options.endpoint ?? DEFAULT_ENDPOINT;
  const fetchFn = getFetch(options.fetch);

  if (!fetchFn) {
    throw new ValidatorFeedbackError(
      'fetch is not available. Use Node 18+, a modern browser, or pass options.fetch.',
    );
  }

  /**
   * @param {Record<string, unknown>} feedback
   * @param {{ includeContext?: boolean, route?: string | null }} [submitOptions]
   * @returns {Promise<{ success: true, feedbackId?: string, message: string, raw: unknown }>}
   */
  async function submit(feedback, submitOptions = {}) {
    const { includeContext = true, route: routeOverride } = submitOptions;
    const validated = validateFeedbackInput(feedback);

    let description = validated.description;
    if (includeContext) {
      const ctx = getAutomaticContext({
        route:
          routeOverride !== undefined
            ? routeOverride
            : typeof feedback.route === 'string'
              ? feedback.route
              : undefined,
      });
      description = appendContextBlock(description, ctx);
      if (description.length > MAX_DESCRIPTION_LENGTH + 5000) {
        description = description.slice(0, MAX_DESCRIPTION_LENGTH + 5000);
      }
    }

    const payload = {
      description,
      feedback_type: validated.feedback_type,
      priority: validated.priority,
      user_email: validated.user_email,
    };

    let response;
    try {
      response = await fetchFn(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Key': appKey,
        },
        body: JSON.stringify(payload),
      });
    } catch {
      throw new ValidatorFeedbackError(
        'We could not reach the feedback service. Check your connection and try again.',
        { code: 'NETWORK_ERROR' },
      );
    }

    let bodyText = '';
    try {
      bodyText = await response.text();
    } catch {
      bodyText = '';
    }

    let parsed = null;
    if (bodyText) {
      try {
        parsed = JSON.parse(bodyText);
      } catch {
        parsed = null;
      }
    }

    if (response.status === 429) {
      const msg =
        (parsed && typeof parsed === 'object' && parsed.message) ||
        'Too many submissions right now. Please wait a few minutes and try again.';
      throw new ValidatorFeedbackError(String(msg), {
        status: 429,
        code: 'RATE_LIMIT',
        body: parsed,
      });
    }

    if (!response.ok) {
      const msg =
        (parsed && typeof parsed === 'object' && parsed.message) ||
        `Something went wrong (HTTP ${response.status}). Please try again later.`;
      throw new ValidatorFeedbackError(String(msg), { status: response.status, body: parsed });
    }

    if (!parsed || typeof parsed !== 'object') {
      throw new ValidatorFeedbackError(
        'The server response was not valid. Please try again later.',
        { body: bodyText },
      );
    }

    if (parsed.success === false) {
      const msg = parsed.message
        ? String(parsed.message)
        : 'Your feedback could not be recorded. Please try again.';
      throw new ValidatorFeedbackError(msg, { status: response.status, body: parsed });
    }

    const message =
      typeof parsed.message === 'string' && parsed.message.length > 0
        ? parsed.message
        : 'Thank you — your feedback was submitted.';

    return {
      success: true,
      feedbackId: parsed.feedback_id ?? parsed.feedbackId,
      message,
      raw: parsed,
    };
  }

  return {
    submit,
    validateFeedbackInput,
    getAutomaticContext,
    sanitizeRelativePath,
  };
}

/** Default client using cohort app key and factory endpoint */
export const ValidatorFeedback = createValidatorFeedbackClient();

export default ValidatorFeedback;