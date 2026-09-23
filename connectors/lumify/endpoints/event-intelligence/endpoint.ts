import { defineEndpoint, UsageModelKind } from "@shared/core";
import {
    zEventIntelligencePathParams,
    zEventIntelligenceQueryParams,
} from "./schema/inputs.ts";

export default defineEndpoint({
    meta: {
        displayName: "Get Event Bet Intelligence",
        summary: "Get synthesized bet intelligence for an event.",
        description:
            "Get synthesized bet intelligence for one event by its event id \u2014 a judgment layer over the odds, line movement, and public splits, with any bet recommendation and its supporting signals. Pass bookmaker to anchor to a specific book.",
        docsUrl: "https://lumify.ai/docs",
        categories: ["sports-betting"],
    },
    request: { method: "GET", path: "/events/{event_id}/intelligence" },
    input: {
        schema: {
            pathParams: zEventIntelligencePathParams,
            queryParams: zEventIntelligenceQueryParams,
        },
    },
    usage: {
        /** One credit per call against the account's Lumify credit pool. */
        model: {
            kind: UsageModelKind.PER_CALL,
            label: "intelligence reads",
            consumes: { credit: "default", amount: 1 },
        },
    },
});
