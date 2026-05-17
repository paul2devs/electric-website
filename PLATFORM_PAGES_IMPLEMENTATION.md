# Platform pages — Contact, About, legal, cookies, hero system

Summary of the marketing and compliance work delivered in this pass.

## Hero system (gradients + mixed typography)

- **`PageHero`** (`components/ui/page-hero.tsx`) — reusable hero with variants:
  - `dark` — deep indigo/black gradient (`hero-shell-dark`)
  - `light` — white → zinc → indigo tint (`hero-shell-light`)
  - `soft` — subtle neutral gradient (`hero-shell-soft`)
- **`HeroTitle`** (`components/ui/hero-title.tsx`) — sans lead + **Playfair Display** italic accent (blue on light, sky on dark)
- **Font:** `Playfair_Display` added in `app/layout.tsx` as `--font-display`
- **Section gradients:** `.section-gradient-muted`, `.section-gradient-surface` in `styles/globals.css`

### Pages updated to use the new hero language

| Page | Hero |
|------|------|
| Home | `HeroSection` — mixed title + existing gradient |
| Services | `ServicePageHero` — `hero-shell-light` + `HeroTitle` |
| Our work | `WorkPageHero` — `PageHero` soft variant |
| Contact | `ContactPageExperience` — `PageHero` dark + image |
| About | `AboutPageExperience` — `PageHero` dark centered |
| Terms / Privacy / Cookies | `LegalDocument` — `PageHero` dark |

## Contact page (`/contact`)

`ContactPageExperience` with:

1. **Hero** — “Get in touch, we're here to help.”
2. **Contact options** — Call, email, emergency (book emergency slug)
3. **Form** — Name, email, phone, service select, message; validation; mailto submit; success state
4. **Coverage** — Location copy + `/marketing-contact.svg`
5. **Service hours** — From `siteContact` + 24/7 emergency line
6. **FAQ** — `lib/data/contact-faq.ts`
7. **Final CTA** — Browse services / book

Query params (`topic`, `service`, `project`) still prefill context and form fields.

## About page (`/about`)

`AboutPageExperience` with:

1. Hero  
2. Brand statement  
3. What we do (4 pillars)  
4. How we work (mindset lines)  
5. Stats (display serif numbers)  
6. Visual section — `/marketing-about.svg`  
7. Values  
8. Book CTA  

Content in `lib/data/about-content.ts`.

## Legal pages

| Route | Content source |
|-------|----------------|
| `/terms` | `lib/content/legal-documents.ts` → `termsOfServiceDocument` |
| `/privacy` | `privacyPolicyDocument` |
| `/cookies` | `cookiePolicyDocument` |

Rendered via `components/legal/legal-document.tsx`.

## Cookie consent

- **`CookieConsentBanner`** — fixed bottom bar; Accept / Reject optional cookies
- Storage: `lib/cookies/consent-storage.ts` → `localStorage` key `testimonydot.cookie.consent.v1`
- Mounted in root `app/layout.tsx`
- Policy link → `/cookies`

## Registration compliance

- Checkbox on **`RegisterForm`**: must accept Terms + Privacy before submit
- Validated in `use-register-form` (`acceptedTerms`)
- Links open `/terms` and `/privacy` in new tabs

## Footer

Legal links: Terms, Privacy, Cookies (`siteFooterLegalLinks`).

## Breadcrumbs

Trails for `/terms`, `/privacy`, `/cookies`.

---

## Environment variables

No new required variables. Same as existing platform:

### Frontend

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_API_BASE_URL` | API base URL |
| `NEXT_PUBLIC_APP_URL` | Canonical site URL |
| `NEXT_PUBLIC_WHATSAPP_E164` / `NEXT_PUBLIC_WHATSAPP_PHONE` | WhatsApp float |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Contact + mailto (default `testimonydot@gmail.com`) |
| `NEXT_PUBLIC_CONTACT_PHONE_DISPLAY` | Footer / contact display |
| `NEXT_PUBLIC_CONTACT_PHONE_TEL` | `tel:` link |
| `NEXT_PUBLIC_SERVICE_HOURS_WEEKDAY` | Optional hours override |
| `NEXT_PUBLIC_SERVICE_COVERAGE` | Optional coverage line override |
| `NEXT_PUBLIC_SOCIAL_*` | Optional social URLs |

### Backend

Unchanged — see `SERVICES_PLATFORM_IMPLEMENTATION.md` and `OUR_WORK_IMPLEMENTATION.md` for `DATABASE_URL`, `REDIS_URL`, JWT, SMTP, etc.

---

## Assets

Images reference **`public/`** only, e.g.:

- `/marketing-contact.svg`
- `/marketing-about.svg`
- `/hero-electrician.svg`

Replace files in `public/` without code changes when you have final photography.
