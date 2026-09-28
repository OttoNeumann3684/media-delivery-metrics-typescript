import { z } from "zod";
import { infrai } from "./infrai_client.ts";

export const deliveryBody = z.object({
  assetId: z.string().min(1),
  creatorId: z.string().min(1),
  durationSeconds: z.number().positive(),
  processingSeconds: z.number().nonnegative(),
});

export type Delivery = z.infer<typeof deliveryBody>;

export function processingDecision(input: Delivery): "ready" | "review" {
  return input.processingSeconds <= input.durationSeconds * 2 ? "ready" : "review";
}

export async function reportDelivery(input: unknown) {
  const delivery = deliveryBody.parse(input);
  const decision = processingDecision(delivery);
  const tags = { asset_id: delivery.assetId, creator_id: delivery.creatorId, decision };
  await infrai.metrics.report({ type: "counter", name: "media.asset.ingested", value: 1, tags });
  await infrai.metrics.report({ type: "gauge", name: "media.processing.seconds", value: delivery.processingSeconds, tags });
  await infrai.metrics.report({ type: "counter", name: "creator.delivery.completed", value: decision === "ready" ? 1 : 0, tags });
  return { assetId: delivery.assetId, creatorId: delivery.creatorId, decision };
}
