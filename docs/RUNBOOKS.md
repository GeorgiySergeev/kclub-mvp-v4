# Operational Runbooks

This document covers the highest-value operator scenarios for MVP launch.

## Stripe Webhook Failed

Symptoms:

- VIP subscription does not appear active
- approved business never becomes published

Check:

1. Stripe event delivery status
2. webhook signature secret
3. product-core logs
4. `stripe_webhook_events` storage

Action:

1. fix secret/config issue
2. replay event through supported mechanism:
   - **Stripe Dashboard**: Developers → Webhooks → find event → "Resend". Safe because product-core deduplicates by event ID.
   - **product-core admin replay API**: `POST /api/admin/v1/webhooks/{eventId}/replay` is specified but **not yet implemented**. Prefer Stripe Dashboard resend.
3. verify subscription/business state after replay

## Approved Business Not Published

Check:

1. business status is `APPROVED`
2. user started placement checkout
3. Stripe checkout completed
4. webhook arrived and passed signature validation

Action:

1. if payment did not complete, tell support/product no publication should happen
2. if payment completed but webhook failed, replay/fix webhook

## VIP Expired But Access Still Active

Check:

1. Stripe subscription status
2. local `vip_subscriptions` row
3. cron run status
4. member capability logic

Action:

1. replay/update subscription event if stale
2. run or repair cron if expiration cleanup failed

## Staff Lost 2FA

Check:

1. confirm staff identity and role
2. verify this is a legitimate access recovery request

Action:

1. OWNER performs reset through the approved pathway
2. staff re-enrolls TOTP
3. record action in audit log or operator notes

## Featured Slots Full

Check:

1. count current `featured_top`
2. count current `featured_recommended`
3. ensure target business is `PUBLISHED`

Action:

1. remove an existing featured business if business decision allows
2. retry toggle

## Cron Did Not Run

Check:

1. deploy config and cron schedule
2. auth secret
3. product-core logs

Action:

1. fix schedule or secret
2. run safe manual backfill by calling `POST /api/cron/daily-maintenance` with `Authorization: Bearer <CRON_SECRET>`
3. verify expired subscriptions/cards/business visibility after recovery
