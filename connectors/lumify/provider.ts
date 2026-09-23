import { defineProvider, presets } from "@shared/core";

/**
 * Lumify (lumify.ai) — an agent-ready sports intelligence API. One wire
 * surface, `https://lumify.ai/v1/<path>`, Bearer auth (`Authorization:
 * Bearer lmfy-...`). Synchronous JSON: schedules and live scores, current
 * multi-book odds and line-movement history, public betting splits, and
 * per-event bet intelligence, plus team and player reference data. Results
 * come back inline; nothing polls.
 *
 * BILLING. Lumify meters usage in a single pool of account CREDITS; a call's
 * draw depends on what data is available at request time (the account's own
 * `/v1/estimate` returns the min/max credits for a planned call), so no
 * per-endpoint credit count rides the response body. Each endpoint here
 * pins a flat PER_CALL draw of one credit against that pool — the honest
 * floor; the $/credit of the plan and any per-tool weighting are the hosted
 * rate card's job, not the connector's. No `consolidate`: the vendor does
 * not report a per-response meter, so the declared model IS the bill.
 *
 * Errors are real non-2xx `{ error: { code, message, status, doc_url },
 * detail }` bodies — `output.fromError` digests them; the engine zero-bills
 * every non-2xx envelope.
 */
export default defineProvider({
    name: "lumify",
    meta: {
        displayName: "Lumify",
        summary:
            "Agent-ready sports data: schedules, live scores, multi-book odds, line movement, public betting splits, and bet intelligence.",
        description: "The sports intelligence API for agents — list sports " +
            "and events, read live scores and final results, pull current " +
            "odds and full line-movement history across major sportsbooks, " +
            "see how the public is betting with money and ticket splits, get " +
            "per-event bet intelligence, and resolve team and player " +
            "reference data. One key, one JSON surface, no scrapers or " +
            "per-book integrations to run.",
        homepageUrl: "https://lumify.ai",
        docsUrl: "https://lumify.ai/docs",
        categories: ["sports-data", "sports-betting"],
        notes: [
            "Failed requests are not billed: the engine zero-bills every " +
            "non-2xx response.",
            "A call's credit draw varies with the data available at request " +
            "time; the account's estimate endpoint returns the min/max " +
            "credits for a planned call before you make it.",
        ],
    },
    auth: { inject: presets.auth.bearer() },
    request: { baseUrl: "https://lumify.ai/v1" },
    timeouts: { requestMs: 30_000, runMs: 30_000 },
    usage: {
        /** THE credit system: Lumify meters ONE pool of account API credits,
         *  so the pool is that unit and the id is `default`. The $/credit of
         *  the plan is the hosted rate card's job, not the doc's. */
        credits: {
            default: {
                label: "Lumify credits",
                description:
                    "the account's Lumify API credit balance; each call " +
                    "draws from it",
            },
        },
    },
    output: {
        /** Lumify errors are real non-2xx `{ error: { code, message,
         *  status, doc_url }, detail }` bodies. Runs only on provider
         *  errors, after zero-usage forcing; the raw body rides under
         *  `raw` — digest, never hide. */
        fromError: ({ data, utils }) => {
            const message = utils.json.optionalGet(
                data.output,
                "$.error.message",
            );
            const detail = utils.json.optionalGet(data.output, "$.detail");
            const code = utils.json.optionalGet(data.output, "$.error.code");
            return {
                message: typeof message === "string" && message !== ""
                    ? message
                    : typeof detail === "string" && detail !== ""
                    ? detail
                    : "Lumify API error",
                ...(typeof code === "string" ? { error_code: code } : {}),
                raw: data.output,
            };
        },
    },
});
