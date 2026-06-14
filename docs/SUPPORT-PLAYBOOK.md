# Support Playbook

This document helps support and operations staff understand what they can check and how to escalate.

## Core Principles

- Support is read-only unless explicitly granted higher role.
- Product-core admin APIs are the operational source of truth.
- Do not guess billing or publication state from UI alone; verify in admin data.

## Common Checks

### Member Cannot Access Dashboard

Check:

- account status
- onboarding completion
- active session
- subscription status if VIP-only feature involved

### Card Verification Problem

Check:

- card number format
- card status: active, revoked, expired
- whether public verification endpoint returns safe result

### Business Not Visible

Check:

- business status
- payment/publication status
- whether featured flag is confused with publication

### Introduction Not Available

Check:

- user is VIP
- user has published business
- rate limit or cooldown not exceeded

## Escalation

Escalate to ADMIN or OWNER when:

- account must be blocked/unblocked
- subscription override is requested
- staff 2FA reset is needed
- billing/webhook inconsistency exists
- featured slot decision is required

## Never Do

- never expose private member data in support messages
- never share raw Stripe or auth secrets
- never describe unpublished business as live
