import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const stripeWebhooks = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_kEY);
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    // req.body must be the raw body (Buffer) — server.js registers this route with express.raw()
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const sessionList = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });
        const session = sessionList.data[0];
        const { transactionId, appId } = session?.metadata || {};

        if (appId === "quickgpt" && transactionId) {
          const transaction = await Transaction.findOne({ _id: transactionId, isPaid: false });
          if (transaction) {
            await User.updateOne({ _id: transaction.userId }, { $inc: { credits: transaction.credits } });
            transaction.isPaid = true;
            await transaction.save();
          }
        } else {
          return res.json({ received: true, message: "Ignored event - invalid app or missing metadata" });
        }
        break;
      }

      case "checkout.session.completed": {
        // handle checkout.session.completed directly (session metadata contains transactionId)
        const session = event.data.object;
        const { transactionId, appId } = session?.metadata || {};

        if (appId === "quickgpt" && transactionId) {
          const transaction = await Transaction.findOne({ _id: transactionId, isPaid: false });
          if (transaction) {
            await User.updateOne({ _id: transaction.userId }, { $inc: { credits: transaction.credits } });
            transaction.isPaid = true;
            await transaction.save();
          }
        }
        break;
      }

      default:
        console.log("unhandled event type", event.type);
        break;
    }

    return res.json({ received: true });
  } catch (error) {
    console.error("webhook processing error", error);
    return res.status(500).send("internal server error");
  }
};
