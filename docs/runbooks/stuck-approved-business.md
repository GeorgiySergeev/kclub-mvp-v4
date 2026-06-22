# Runbook: Stuck Approved Business

**Severity**: Medium

## Symptoms

- Business profile has `status: 'APPROVED'` but never transitions to `PUBLISHED`
- User reports their business is "approved but not visible on the directory"
- Business does not appear in public directory

## Background

A business transitions `APPROVED → PUBLISHED` when:

- Admin approves the profile (sets status to `APPROVED`)
- The owner has an **active VIP subscription** (not expired, not past due)
- The system auto-publishes (or admin manually publishes)

A business stays in `APPROVED` if the owner lacks an active VIP capability.

## Diagnosis

1. Check the business status and owner:

   ```sql
   SELECT bp.id, bp.status, bp.user_id, u.membership_tier
   FROM business_profiles bp
   JOIN users u ON u.id = bp.user_id
   WHERE bp.status = 'APPROVED'
   ORDER BY bp.updated_at DESC;
   ```

2. Check the owner's subscription:

   ```sql
   SELECT id, status, current_period_start, current_period_end
   FROM vip_subscriptions
   WHERE user_id = '<userId>'
   ORDER BY created_at DESC LIMIT 1;
   ```

3. If subscription is `ACTIVE` but business is still `APPROVED`, check audit logs:
   ```sql
   SELECT * FROM audit_logs
   WHERE entity_id = '<businessId>' AND action = 'BUSINESS_APPROVED'
   ORDER BY created_at DESC;
   ```

## Resolution

1. **Owner has active VIP** → Admin manually publishes:

   ```
   PUT /api/admin/v1/businesses/{id}/publish
   ```

   Or use the admin dashboard "Publish" button.

2. **Owner subscription is EXPIRED/PAST_DUE** → Inform the owner to renew VIP. The business will auto-publish when subscription becomes active.

3. **Cron not running** → If subscription is active but auto-publish didn't fire, trigger daily maintenance:
   ```
   POST /api/cron/daily-maintenance
   Authorization: Bearer <cron-secret>
   ```

## Prevention

- Add monitoring alert for businesses stuck in `APPROVED` > 24 hours
- Consider a cron job step to auto-publish approved businesses with active VIP
