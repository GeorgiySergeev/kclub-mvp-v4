# Seed Data

KCLUB MVP v4 requires reference data before the product is usable.

## Required Seeds

### Geography

- countries used by the MVP
- cities linked to valid countries

### Categories

- partner/business categories
- `is_high_risk` flag for blocked categories such as crypto, gambling, adult, firearms, unlicensed financial, high-risk investments

### Admin Bootstrap

- one initial OWNER staff account creation path
- optional ADMIN and MODERATOR bootstrap accounts for staging

### Config

- empty or initial Stripe price config keys
- initial platform settings rows if required by schema

## Environment Rules

- local development may include demo data
- staging should include realistic but safe data
- production should include only approved reference data and required bootstrap config

## Validation

After seed:

- business submission category selection works
- city-country validation works
- admin taxonomy screens load
- high-risk categories are blocked in business submission
