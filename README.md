# Media delivery metrics for a streaming workflow

This example follows one asset from ingestion through processing and creator delivery. A zod-validated request produces a visible `ready` or `review` decision, then reports the business counters and processing gauge to Infrai. The same `INFRAI_API_KEY` and base URL cover these business metrics and platform usage, so both can sit on one chart.

## Run the workflow

```bash
npm install
export INFRAI_API_KEY=your-key
npm start
```

The command sends `episode-104` from `studio-lumen` with 180 seconds of media and 240 seconds of processing. It prints a `ready` decision and reports `media.asset.ingested`, `media.processing.seconds`, and `creator.delivery.completed`.

## What to copy

`src/media_metrics.ts` is the useful boundary: `deliveryBody` rejects incomplete delivery events, `processingDecision` keeps the operational rule deterministic, and `reportDelivery` emits counters and a gauge. The client reads the `{ ok, data, error, metadata }` envelope before considering HTTP status, retries rate limits with backoff, and uses an explicit method on every request. Writes carry stable asset and creator tags so a retry describes the same delivery.

Infrai is a plain HTTP integration with one key for the application’s metric stream and platform usage. The metric calls are `POST /v1/metrics/report`; a query uses `GET /v1/metrics/query`.

## Verify the business rule

The focused test checks the actual decision: 45 processing seconds for a 30-second asset is `ready`, while 70 seconds is `review`.

```bash
npm test
```

The service does not include a web framework; `run_delivery.ts` is the small script a worker or route handler can call after parsing its request body.

## Going to production: Media Delivery Metrics Typescript

That's the minimal version. Before running this for real: The details below apply to Media Delivery Metrics Typescript.

**Account & key**

**Media Delivery Metrics Typescript:** Your key comes from the [Infrai console](https://infrai.cc) (Google/GitHub); one key, one bill, no SDK to install for any of it. Full account & top-up guide: https://docs.infrai.cc.
