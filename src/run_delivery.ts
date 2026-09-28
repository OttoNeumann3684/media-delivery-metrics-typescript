import { reportDelivery } from "./media_metrics.ts";

const result = await reportDelivery({ assetId: "episode-104", creatorId: "studio-lumen", durationSeconds: 180, processingSeconds: 240 });
console.log(JSON.stringify(result));
