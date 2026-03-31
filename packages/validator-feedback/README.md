# Validator Feedback client

JavaScript client for the Software Factory Validator Feedback API (**PDLC-Cohort2-Doyle**).

## Behaviour

- Validates description, `feedback_type`, `priority`, and optional email before `POST`.
- Appends automatic **context** to the description body only: **relative path** (never full URL), **user agent**, and **ISO timestamp** — so the HTTP JSON body still matches the documented schema.
- Maps network failures, non-JSON responses, HTTP errors, and **429** rate limits to clear `ValidatorFeedbackError` messages.

## Usage

```javascript
import { ValidatorFeedback, ValidatorFeedbackError, createValidatorFeedbackClient } from '@pdlc/validator-feedback';

// Default client (built-in app key — override in production via env)
const result = await ValidatorFeedback.submit({
  description: 'Checkout fails when wallet is empty',
  type: 'bug',
  priority: 'medium',
  email: 'optional@example.com',
});
console.log(result.message, result.feedbackId);

const custom = createValidatorFeedbackClient({
  appKey: process.env.VALIDATOR_APP_KEY, // browser: inject at build time
});
```

## Examples

- React: `examples/FeedbackForm.jsx`
- Global `window` errors: `examples/globalErrorHook.js`

## Requirements

- **Node 18+** or a browser with `fetch`.
