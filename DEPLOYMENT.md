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
4. Accept default Next.js settings (Vercel auto-detects)
5. Click **"Deploy"**

Once deployed, Vercel will give you a default URL like `raah-production-3w4h.vercel.app`

---

## Step 2: Add Environment Variables in Vercel Dashboard

After project is created, go to **Settings → Environment Variables** and add these for **Production** environment:

### Public Variables (visible in browser)
```
NEXT_PUBLIC_SANITY_PROJECT_ID          = [your value]
NEXT_PUBLIC_SANITY_DATASET             = production
NEXT_PUBLIC_SANITY_API_VERSION         = 2024-01-01
NEXT_PUBLIC_SUPABASE_URL               = [your value]
NEXT_PUBLIC_SUPABASE_ANON_KEY          = [your value]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY     = [your value]
NEXT_PUBLIC_APP_URL                    = https://raahproduction.ca
```

### Secret Variables (server-only)
```
SUPABASE_SERVICE_ROLE_KEY              = [your value]
STRIPE_SECRET_KEY                      = [your value]
STRIPE_WEBHOOK_SECRET                  = [your value]
RESEND_API_KEY                         = [your value]
RESEND_FROM_EMAIL                      = tickets@raah.production
RESEND_FROM_NAME                       = Raah Production
CONTACT_TO_EMAIL                       = hello@raahproduction.ca
SANITY_API_TOKEN                       = [your value]
```

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

## Step 4: Update Stripe Webhook URL

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Webhooks** (under Developers)
3. Find your existing webhook for checkout events
4. Edit the endpoint URL to: `https://raahproduction.ca/api/webhooks/stripe`
5. **Keep the webhook signing secret** — it goes in `STRIPE_WEBHOOK_SECRET` above

---

## Step 5: Update Sanity CORS Origins

1. Go to [Sanity Studio](https://sanity.io/manage)
2. Select your Raah Production project
3. Go to **API → CORS Origins**
4. Add new origin: `https://raahproduction.ca`
5. Add origin for Vercel preview deployments: `https://*.vercel.app`

---

## Step 6: Test Full Purchase Flow

### Quick Smoke Test (2 min)

1. Visit `https://raahproduction.ca` (or your Vercel preview URL)
2. Navigate to a show page
3. Click "Reserve Tickets"
4. Complete a test Stripe payment (use Stripe test card: `4242 4242 4242 4242`)
5. Verify you land on success page with order details
6. Check your email for confirmation email from Resend

### Verification Checks

**Email received?**
- ✅ Confirmation email should arrive within 30 seconds
- ✅ Email shows correct show name, date, venue
- ✅ Order reference number matches Vercel logs

**Stripe webhook fired?**
- Go to Stripe Dashboard → **Webhooks** → click your endpoint
- Look for recent `checkout.session.completed` event with `200` status
- Click event to see full payload

**Supabase order created?**
- Go to [Supabase Dashboard](https://supabase.com/dashboard)
- Check `orders` table — should see new row with `status: 'paid'`
- Check `customers` table — should see new customer record
- Check `order_items` table — should see ticket details

---

## Troubleshooting

### Email not received
- Check RESEND_API_KEY is set in Vercel (not expired)
- Check RESEND_FROM_EMAIL matches your Resend sender domain
- Look at Vercel logs: `vercel logs` command or dashboard logs

### Stripe webhook not firing
- Verify webhook endpoint URL in Stripe Dashboard: `https://raahproduction.ca/api/webhooks/stripe`
- Verify STRIPE_WEBHOOK_SECRET is correct
- Check Stripe Dashboard → Webhooks → Event Log for errors

### Show details not loading
- Verify NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET are correct
- Verify Sanity CORS origins include `https://raahproduction.ca`
- Check Sanity has live published shows

### Stripe payment fails
- Verify NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is correct (matches STRIPE_SECRET_KEY environment)
- Verify ticket inventory has quantity > 0 in Supabase

---

## Post-Deployment Checklist

- [ ] Domain resolves to Vercel (ping `raahproduction.ca`)
- [ ] Test purchase completes successfully
- [ ] Confirmation email received
- [ ] Stripe webhook shows `200` status in Stripe Dashboard
- [ ] Order appears in Supabase dashboard
- [ ] Sanity CMS is accessible
- [ ] All pages load without 500 errors
- [ ] Links navigate correctly
- [ ] Form submissions work (contact form, etc.)

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
- **Stripe webhook testing**: https://stripe.com/docs/webhooks/test
- **Sanity CORS**: https://www.sanity.io/docs/cors
