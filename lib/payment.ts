/*
 * Mock payment service.
 *
 * To switch to Stripe (test mode first):
 *   1. `npm i stripe @stripe/stripe-js @stripe/react-stripe-js`
 *   2. Add a Route Handler (app/api/checkout/route.ts) that creates a
 *      PaymentIntent server-side for the cart total using STRIPE_SECRET_KEY.
 *      Always recompute the amount on the server from product IDs.
 *   3. In the payment step, replace the demo card fields with Stripe's
 *      <PaymentElement /> and call `stripe.confirmPayment()`.
 *   4. Replace `processPayment` below with a call that returns the same
 *      `PaymentResult` shape, so the checkout UI does not need to change.
 *
 * Card details never need to touch this app's code once Stripe Elements is in place.
 */

export interface PaymentRequest {
  /** Amount in cents. */
  amount: number;
  currency: "EUR";
  email: string;
  /** Only the last four digits ever leave the form component. */
  cardLast4: string;
}

export type PaymentResult =
  | { status: "succeeded"; orderId: string }
  | { status: "declined"; reason: string };

/** Stripe's documented "generic decline" test card, honoured by the mock too. */
const DECLINE_TEST_CARD_LAST4 = "0002";

export async function processPayment(request: PaymentRequest): Promise<PaymentResult> {
  await new Promise((resolve) => setTimeout(resolve, 1400));

  if (request.cardLast4 === DECLINE_TEST_CARD_LAST4) {
    return { status: "declined", reason: "card_declined" };
  }
  return { status: "succeeded", orderId: createOrderId() };
}

function createOrderId(): string {
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `ML-${new Date().getFullYear()}-${random}`;
}
