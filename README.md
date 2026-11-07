# ProfileSpark MVP (front-end demo)

A mobile-first prototype for a dating-profile presentation coach.

## Run it

Open `index.html` in a modern browser, or serve the folder locally:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## What works

- Responsive landing page and profile input form.
- Optional local image preview (JPG, PNG, WEBP; max 8 MB).
- 18+ confirmation gate.
- Local heuristic profile-clarity score and tailored first tip.
- Result card and native share / copy-link fallback.
- No account, database, analytics, network upload, or persistent storage.

## Important prototype limitations

This is a working front-end demo, not the production AI product. The score is a transparent local heuristic based on bio completeness and whether a photo was added. It does **not** inspect faces, rate attractiveness, infer sensitive traits, or provide objective dating predictions. The uploaded image remains in the browser and is only displayed as a preview. The AI, payment, referral verification, leaderboard, and analytics systems are not connected. No payment should be accepted from this prototype.

## Recommended production direction

1. Keep the product focused on profile clarity and photo presentation (lighting, framing, background, image quality), not attractiveness or personal worth.
2. Add a server-side AI endpoint only after selecting a model provider and setting API keys as server-side environment variables. Do not expose API keys in browser JavaScript.
3. If images are processed remotely, use explicit consent, short retention, deletion controls, clear privacy terms, encryption in transit, and a documented data-processing setup. Consider an adult-only service and jurisdiction-specific legal review.
4. Use Stripe Checkout or a merchant-of-record provider only after configuring a verified business account, webhook signature validation, order fulfilment, tax handling, refunds, and dispute processes.
5. Do not claim a share was completed based only on `navigator.share()` opening. Browsers do not provide a reliable proof that content was posted. Keep sharing optional; verify referral rewards server-side after genuine qualifying activity.
6. Launch with a small number of genuinely useful SEO pages. Avoid mass-generating thin doorway pages. Measure scan completion, repeat usage, referral conversion, paid conversion, retention, refunds, and AI cost per completed report.

## Suggested production stack

- Next.js (App Router) for frontend and server routes
- Supabase Auth + Postgres with row-level security for account and referral data
- Server-side model API for bio feedback and optional consent-based photo composition checks
- Stripe Checkout + signed webhooks for one-time purchases and subscriptions
- PostHog or Plausible for privacy-conscious, consent-aware analytics

Before launch, get jurisdiction-specific advice on privacy, consumer protection, age gating, payments, subscriptions, and marketing claims.
