import { defineEndpoint, UsageModelKind } from "@shared/core";
import {
    zEventOddsPathParams,
    zEventOddsQueryParams,
} from "./schema/inputs.ts";

export default defineEndpoint({
    meta: {
        displayName: "Get Event Odds",
        summary: "Get current betting odds for an event across books.",
        description:
            "Get the current betting odds for one event by its event id \u2014 moneyline, spread, and totals \u2014 from a chosen sportsbook (defaults to the sharpest book). Pass bookmaker to select a specific book.",
        docsUrl: "https://lumify.ai/docs",
        categories: ["sports-betting"],
    },
    request: { method: "GET", path: "/events/{event_id}/odds" },
    input: {
        schema: {
            pathParams: zEventOddsPathParams,
            queryParams: zEventOddsQueryParams,
        },
    },
    usage: {
        /** One credit per call against the account's Lumify credit pool. */
        model: {
            kind: UsageModelKind.PER_CALL,
            label: "odds reads",
            consumes: { credit: "default", amount: 1 },
        },
    },
});
