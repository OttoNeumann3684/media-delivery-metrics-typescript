import assert from "node:assert/strict";
import { processingDecision } from "./media_metrics.ts";

assert.equal(processingDecision({ assetId: "clip-7", creatorId: "creator-2", durationSeconds: 30, processingSeconds: 45 }), "ready");
assert.equal(processingDecision({ assetId: "clip-8", creatorId: "creator-2", durationSeconds: 30, processingSeconds: 70 }), "review");
console.log("processing decision test passed");
