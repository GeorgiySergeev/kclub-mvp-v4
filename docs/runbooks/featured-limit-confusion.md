# Runbook: Featured Business Limit Confusion

**Severity**: Low

## Symptoms

- Admin sees `FEATURED_LIMIT_REACHED` error when trying to feature a business
- Admin claims the count is below the limit of 3
- Featured top and featured recommended counts appear inconsistent

## Background

The system enforces two separate limits:

- **Maximum 3** businesses with `featured_top = true`
- **Maximum 3** businesses with `featured_recommended = true`

A business can have both flags simultaneously, counting toward BOTH limits.

A business also loses its featured flags when:

- The business is hidden (owner loses VIP)
- The business is rejected
- The "unfeature" action is taken

## Diagnosis

1. **Check current counts**:

   ```sql
   SELECT
     COUNT(*) FILTER (WHERE featured_top = true) AS featured_top_count,
     COUNT(*) FILTER (WHERE featured_recommended = true) AS featured_recommended_count
   FROM business_profiles
   WHERE status IN ('PUBLISHED', 'APPROVED');
   ```

2. **List featured businesses**:

   ```sql
   SELECT id, name, status, featured_top, featured_recommended
   FROM business_profiles
   WHERE featured_top = true OR featured_recommended = true
   ORDER BY featured_top DESC, featured_recommended DESC;
   ```

3. **Check if hidden businesses still have flags**:
   ```sql
   SELECT id, name, status, featured_top, featured_recommended
   FROM business_profiles
   WHERE (featured_top = true OR featured_recommended = true) AND status = 'HIDDEN';
   ```

## Resolution

1. **If hidden businesses still have featured flags**: The daily maintenance cron should clear them on hiding. If not, manually clear:

   ```sql
   UPDATE business_profiles
   SET featured_top = false, featured_recommended = false
   WHERE id = '<businessId>';
   ```

2. **If counts genuinely exceed limits**: This indicates a race condition or a previous cron failure. Unfeature a business to make room:
   - Admin dashboard: find a featured business → toggle off the featured flag
   - Or via API: `PUT /api/admin/v1/businesses/{id}/feature`

3. **If the error appears when count < 3**: Check if the target business meets requirements:
   - Business must have `status = 'PUBLISHED'`
   - Owner must have active VIP subscription

## Prevention

- The featured toggle should be wrapped in a DB transaction with `SELECT ... FOR UPDATE` to prevent race conditions
- Consider a reconciliation script that fixes inconsistent featured flags
