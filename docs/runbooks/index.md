# KCLUB Operational Runbooks

Production support reference for MVP v4.

## Runbooks

| Scenario                          | Severity | Link                                                       |
| --------------------------------- | -------- | ---------------------------------------------------------- |
| Failed Stripe webhook             | High     | [failed-stripe-webhook.md](failed-stripe-webhook.md)       |
| Duplicate webhook event           | Low      | [duplicate-webhook-event.md](duplicate-webhook-event.md)   |
| Stuck approved business           | Medium   | [stuck-approved-business.md](stuck-approved-business.md)   |
| Expired VIP still seeing access   | Medium   | [expired-vip-access.md](expired-vip-access.md)             |
| Staff lost 2FA                    | High     | [staff-lost-2fa.md](staff-lost-2fa.md)                     |
| Featured business limit confusion | Low      | [featured-limit-confusion.md](featured-limit-confusion.md) |

## Quick Commands

```bash
# Check health
curl https://www.kylyvnyk.club/api/health

# Check admin-app health
curl https://admin.kylyvnyk.club/api/health

# View recent structured logs (Vercel)
# Navigate to: Vercel Dashboard > Project > Logs
# Filter by: domain:webhook, domain:cron, domain:auth, level:error

# Replay a webhook (admin API)
# POST /api/admin/v1/webhooks/{eventId}/replay
```

## Escalation

- **Technical issues**: Lead developer
- **Billing/data issues**: Project owner
- **Security incidents**: Project owner
