# Observability

This document defines the minimum observability baseline for launch.

## Logging

Use structured logs for:

- API errors
- auth failures
- webhook processing
- cron execution
- admin state-changing actions
- deployment and startup failures

Logs must avoid:

- OTP values
- TOTP secrets
- tokens
- service-role keys
- payment secrets

## Correlation

Where possible, include:

- request id
- actor id
- role
- route
- environment
- Stripe event id for webhook logs

## Health Checks

Support at least:

- app boot success
- health/readiness endpoint
- database connectivity check if safe
- webhook route availability

## Monitoring Expectations

Recommended signals:

- 5xx rate on product-core
- 5xx rate on admin-app
- auth failure spikes
- webhook failure count
- cron failure count
- checkout start without follow-up webhook completion within expected window

## Alert Priorities

High:

- webhook failures
- admin auth failures across many users
- production 5xx spike
- public PII leak or auth bypass

Medium:

- cron failures
- elevated validation errors
- sustained business placement publication lag

Low:

- isolated UX/client errors with workaround
