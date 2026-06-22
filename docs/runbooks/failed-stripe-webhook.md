# Runbook: Failed Stripe Webhook

**Severity**: High

## Symptoms

- `stripe_webhook_events` table has rows with `handler_status: 'FAILED'`
- Pino log entries with `domain:webhook` and level `error`
- User reports VIP upgrade not applied after successful Stripe payment
- User reports business placement not published

## Diagnosis

1. Check the Stripe dashboard: navigate to Developers > Webhooks > KCLUB endpoint. Look at recent delivery attempts.

2. Check the database:

   ```sql
   SELECT id, event_id, event_type, handler_status, error_message, created_at
   FROM stripe_webhook_events
   WHERE handler_status = 'FAILED'
   ORDER BY created_at DESC
   LIMIT 10;
   ```

3. Check structured logs in Vercel:
   ```
   Filter: domain:webhook AND level:error
   ```

## Resolution

1. **Identify the root cause** from the `error_message` column. Common causes:
   - Database connection issue → check if DB is reachable
   - Stripe API version mismatch → verify `apiVersion` in stripe client
   - Missing metadata on Stripe session → verify Stripe session creation includes `type` and `userId`

2. **Fix the underlying issue** (deploy fix if needed).

3. **Replay the failed event** via the admin API:

   ```
   POST /api/admin/v1/webhooks/{eventId}/replay
   Authorization: Bearer <admin-token>
   ```

4. **Verify** the event now shows `handler_status: 'PROCESSED'`:
   ```sql
   SELECT handler_status FROM stripe_webhook_events WHERE id = '<eventId>';
   ```

## Prevention

- Add monitoring alert for `handler_status = 'FAILED'`
- Ensure webhook handler tests cover all event types
