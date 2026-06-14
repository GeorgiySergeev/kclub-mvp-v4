# @kclub/validation

Shared Zod request schemas and side-effect-free validation helpers for product-core and admin-app.

## Service-Level Checks

These checks intentionally stay out of this package because they require database state, authorization context, provider state, or transactions:

- whether a caller has active VIP capability
- whether a caller owns a business or introduction
- whether a user, business, city, country, category, subscription, or introduction exists
- whether a city belongs to the selected country
- whether a category is high-risk
- uniqueness checks for business names, slugs, phones, staff accounts, and Stripe IDs
- business status transition validity
- introduction rate limits and cooldown windows
- featured business max-count enforcement under transaction/lock
- Stripe webhook signature verification and event replay eligibility
