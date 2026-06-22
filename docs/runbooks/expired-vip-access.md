# Runbook: Expired VIP Still Seeing Access

**Severity**: Medium

## Symptoms

- User's `membership_tier` is `VIP` but `vip_subscriptions` are `EXPIRED`
- User can still access VIP features (introductions, business submission)
- Daily maintenance cron should have downgraded them

## Background

VIP capabilities are tied to `membership_tier` on the `users` table. The daily maintenance cron handles:

1. Expiring subscriptions past `current_period_end`
2. Setting `membership_tier` to `MEMBER`
3. Hiding published businesses of expired owners

If the cron fails or has a bug, users retain VIP access past expiration.

## Diagnosis

1. Check the user's subscription:

   ```sql
   SELECT u.id, u.membership_tier, vs.status, vs.current_period_end
   FROM users u
   LEFT JOIN vip_subscriptions vs ON vs.user_id = u.id
   WHERE u.membership_tier = 'VIP' AND (vs.status IS NULL OR vs.status != 'ACTIVE');
   ```

2. Check when the cron last ran successfully:

   ```sql
   SELECT * FROM audit_logs
   WHERE action = 'CRON_DAILY_MAINTENANCE'
   ORDER BY created_at DESC LIMIT 5;
   ```

3. Check the latest cron result:
   ```
   Filter Vercel logs: domain:cron
   Look for "Daily maintenance completed" with result details
   ```

## Resolution

1. **Manual fix** — Set the user back to `MEMBER`:

   ```sql
   UPDATE users SET membership_tier = 'MEMBER' WHERE id = '<userId>';
   ```

2. **Trigger cron** — If cron is not running automatically:

   ```
   POST /api/cron/daily-maintenance
   Authorization: Bearer <cron-secret>
   ```

3. **If cron succeeds but user not downgraded**: Check the cron logic — it expires `vip_subscriptions` rows where `current_period_end < now()`, then finds users whose subscription status is `EXPIRED` and tier is `VIP`. Verify the `vip_subscriptions` row is actually expired.

## Prevention

- Monitor daily maintenance cron execution via Vercel Cron Jobs
- Alert if cron result shows `subscriptionsExpired: 0` for > 24 hours when active subscriptions exist
