# Runbook: Duplicate Webhook Event

**Severity**: Low (by design)

## Symptoms

- Pino log entry `Webhook duplicate event received` with `domain:webhook`
- API response includes `duplicate: true`

## Background

Stripe may deliver the same webhook event multiple times (at-least-once delivery). The system deduplicates by storing the Stripe event ID in `stripe_webhook_events` and checking for existing records before processing.

Duplicates are expected and **safe** — no action needed.

## Diagnosis

1. Check the database:

   ```sql
   SELECT event_id, event_type, handler_status, created_at
   FROM stripe_webhook_events
   WHERE handler_status = 'DUPLICATE_IGNORED' OR (event_id = '<eventId>')
   ORDER BY created_at;
   ```

2. Vercel logs will show:
   ```
   domain:webhook  Webhook duplicate event received  { eventId: "evt_...", eventType: "checkout.session.completed" }
   ```

## Resolution

- **Single duplicate**: No action needed. The first delivery was already processed.
- **Repeated duplicates**: If Stripe is retrying a failed webhook, the first attempt may have `FAILED` — check the primary event row.
- **Unexpected high volume**: Check Stripe dashboard for webhook configuration issues. The event ID is the dedup key.

## Prevention

- Dedup is already in place. If false positives appear, the system is working correctly.
