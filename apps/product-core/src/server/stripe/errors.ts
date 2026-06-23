import Stripe from 'stripe';

import { ERROR_CODES } from '@kclub/contracts';

import { AppError } from '@/server/errors';

export function rethrowStripeCheckoutError(error: unknown): never {
  if (error instanceof Stripe.errors.StripeError) {
    throw new AppError({
      code: ERROR_CODES.CHECKOUT_CREATION_FAILED,
      message: error.message,
      status: error.statusCode ?? 502,
      cause: error,
    });
  }

  throw error;
}
