# Vercel Deployment Guide — Raah Production

## Pre-Deployment ✅

- [x] Production build passes locally (`npm run build`)
- [x] All feature branches merged to `main`
- [x] Branch 18 is ready for deployment

---

## Step 1: Connect GitHub Repo to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import the GitHub repository: `Website-building-business/Raah_production`
4. Set **Framework Preset**: Next.js (auto-detected)
5. Set **Root Directory**: `/` (default)
6. Set **Production Branch**: `main`
7. Click **"Deploy"**

Once deployed, Vercel will give you a default URL like `raah-production-3w4h.vercel.app`

### Enable Preview Deployments for `dev`

After initial deploy:
1. Go to **Settings → Git**
2. Under **Preview Branches**, ensure `dev` is included (Vercel previews all branches by default)
3. Confirm by pushing any commit to `dev` — a preview URL should appear in the GitHub PR/branch status

---

## Step 2: Add Environment Variables in Vercel Dashboard

After project is created, go to **Settings → Environment Variables** and add these variables:

### Public Variables (all environments: Production, Preview, Development)
```
NEXT_PUBLIC_SANITY_PROJECT_ID          = [your Sanity project ID]
NEXT_PUBLIC_SANITY_DATASET             = production
NEXT_PUBLIC_SANITY_API_VERSION         = 2024-01-01
NEXT_PUBLIC_SUPABASE_URL               = [your Supabase project URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY          = [your Supabase anon key]
NEXT_PUBLIC_APP_URL                    = https://raahproduction.ca
```

### Secret Variables (Production and Preview only — do NOT add to Development)
```
SUPABASE_SERVICE_ROLE_KEY              = [your Supabase service role key]
SANITY_API_TOKEN                       = [your Sanity API token with read access]
RESEND_API_KEY                         = [your Resend API key]
RESEND_FROM_EMAIL                      = tickets@raah.production
RESEND_FROM_NAME                       = Raah Production
CONTACT_TO_EMAIL                       = hello@raahproduction.ca
```

**Important**: For server-only variables, set scope to **Production and Preview** (exclude Development).

**Save and redeploy** after adding all variables.

---

## Step 3: Configure Custom Domain

In Vercel dashboard:

1. Go to **Settings → Domains**
2. Add domain: `raahproduction.ca`
3. Vercel will show DNS records to add
4. Go to your domain registrar and add the records (usually CNAME or A records)
5. Wait for DNS propagation (5-30 minutes)

---

## Step 4: Update Sanity CORS Origins

1. Go to [Sanity Studio](https://sanity.io/manage)
2. Select your Raah Production project
3. Go to **API → CORS Origins**
4. Add new origin: `https://raahproduction.ca`
5. Add origin for Vercel preview deployments: `https://*.vercel.app`

---

## Step 5: Configure Supabase Allowed Redirect URLs

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your Raah Production project
3. Go to **Authentication → URL Configuration**
4. Add redirect URL: `https://raahproduction.ca`
5. Add redirect URL for previews: `https://*.vercel.app`

---

## Step 6: Verify Deployment

### Quick Smoke Test (2 min)

1. Visit `https://raahproduction.ca` (or your Vercel preview URL)
2. Verify home page loads with real Sanity show data
3. Navigate to a show detail page
4. Verify "Get Tickets" button appears and links to external ticketing platform
5. Try the contact form — confirm email functionality

### Verification Checks

**Show data loading?**
- ✅ Home page displays upcoming shows from Sanity
- ✅ Show detail page renders show name, date, venue, lineup, poster
- ✅ "Get Tickets" button appears when `ticketUrl` is set in Sanity
- ✅ Button opens external URL in new tab

**Contact form?**
- ✅ Submit contact form via `/contact`
- ✅ Confirmation email arrives within 30 seconds
- ✅ Email shows submitted contact info

---

## Troubleshooting

### Contact email not received
- Check RESEND_API_KEY is set in Vercel (not expired)
- Check RESEND_FROM_EMAIL matches your Resend sender domain
- Look at Vercel logs: **Deployments → click a deployment → Logs** in Vercel dashboard

### Show data not loading
- Verify NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET are correct
- Verify Sanity CORS origins include `https://raahproduction.ca`
- Check Sanity Studio — confirm shows are published (not draft)

### "Get Tickets" button not appearing
- Check that the show document in Sanity has a `ticketUrl` value set
- Draft shows will use the preview URL — ensure you're checking the right environment

### Build fails on Vercel
- Check Vercel function logs for missing environment variables
- Ensure all `NEXT_PUBLIC_*` variables are set on all environments
- Run `npm run build` locally with the same env values to reproduce

---

## Post-Deployment Checklist

- [ ] Domain resolves to Vercel (`raahproduction.ca` loads)
- [ ] Home page shows real Sanity show data (not empty)
- [ ] Show detail page loads with full event info
- [ ] "Get Tickets" button appears on shows with a `ticketUrl` set in Sanity
- [ ] "Get Tickets" button opens external URL in a new tab
- [ ] Contact form submits and sends email
- [ ] Sanity CMS is accessible at `/studio`
- [ ] All pages load without 500 errors
- [ ] `dev` branch push triggers a Vercel preview deployment

---

## Rolling Back

If something breaks after deployment:

1. **Quick fix**: Redeploy from Vercel Dashboard (Settings → Deployments → Redeploy)
2. **Full rollback**: Revert to previous commit on `main` branch
   ```bash
   git revert <commit-hash>
   git push origin main
   ```
3. **DNS emergency**: Point domain back to old server or Vercel preview URL while you fix

---

## Need Help?

- **Vercel docs**: https://vercel.com/docs
- **Sanity CORS docs**: https://www.sanity.io/docs/cors
- **Supabase URL configuration**: https://supabase.com/docs/guides/auth/redirect-urls
