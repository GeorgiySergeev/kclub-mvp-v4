# Runbook: Staff Lost 2FA

**Severity**: High

## Symptoms

- Staff member cannot log in because they lost access to their TOTP authenticator app
- Staff sees "Invalid authenticator code" repeatedly
- Staff cannot access the admin dashboard

## Background

Staff authentication uses TOTP (time-based one-time password) as a second factor. The TOTP secret is stored encrypted in the `admin_2fa` table. Only the **OWNER** role has access to reset another staff member's 2FA.

## Diagnosis

1. **Verify the staff identity** through another channel (phone call, Signal, in-person).

2. Check the staff account:
   ```sql
   SELECT au.id, au.phone, au.role, au.is_active, au.totp_verified_at
   FROM admin_users au
   WHERE au.phone = '<staffPhone>';
   ```

## Resolution

### For OWNER role (reset self via database)

If the owner loses 2FA, they cannot use the admin API (no authenticated session). A direct database operation is required:

1. Connect to the Supabase SQL editor or `psql` with elevated credentials.
2. Delete the TOTP secret:
   ```sql
   DELETE FROM admin_2fa WHERE admin_user_id = '<ownerUserId>';
   UPDATE admin_users SET totp_verified_at = NULL WHERE id = '<ownerUserId>';
   ```
3. The owner now logs in normally, goes through OTP verification, and is prompted to set up TOTP again.

### For MODERATOR/SUPPORT/ADMIN roles

The **OWNER** can reset via the admin dashboard:

1. Owner logs into admin dashboard.
2. Navigate to Staff Management.
3. Find the affected staff member.
4. Click "Reset 2FA".
5. The staff member logs in, verifies OTP, and is prompted to set up new TOTP.

### If owner is unavailable

1. A direct database edit by a developer is required:

   ```sql
   DELETE FROM admin_2fa WHERE admin_user_id = '<staffUserId>';
   UPDATE admin_users SET totp_verified_at = NULL WHERE id = '<staffUserId>';
   ```

## Prevention

- Staff should back up their TOTP secret (scan QR with multiple devices or save backup codes)
- Document TOTP recovery process in staff onboarding

## Security Notes

- Resetting TOTP invalidates the current 2FA binding — the staff member must go through full setup again
- This does NOT invalidate current sessions (they expire after 8 hours)
- All TOTP resets should be logged in the audit trail
