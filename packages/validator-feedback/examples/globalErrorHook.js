/**
 * Optional: report uncaught window errors to Validator (high priority bugs).
 * Only pathname is sent for any script URL — never the full origin.
 */

import { createValidatorFeedbackClient, sanitizeRelativePath } from '../src/index.js';

/**
 * @param {ReturnType<typeof createValidatorFeedbackClient>} client
 * @param {{ includeContext?: boolean }} [options]
 * @returns {() => void} teardown
 */
export function installValidatorWindowErrorReporter(client, options = {}) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const includeContext = options.includeContext !== false;

  const onError = (event) => {
    if (!(event instanceof ErrorEvent)) {
      return;
    }
    const message = event.message;
    const lineno = event.lineno != null ? event.lineno : null;
    const fileRaw = event.filename || null;
    const filePath = fileRaw ? sanitizeRelativePath(fileRaw) : null;

    const parts = [`JavaScript error: ${message || 'Unknown error'}`];
    if (lineno != null) parts.push(`line: ${lineno}`);
    if (filePath) parts.push(`source path: ${filePath}`);

    client
      .submit(
        {
          description: parts.join(' | '),
          type: 'bug',
          priority: 'high',
        },
        { includeContext },
      )
      .catch(() => {
        /* avoid recursive error reporting */
      });
  };

  window.addEventListener('error', onError);
  return () => window.removeEventListener('error', onError);
}
