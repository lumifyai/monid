import { defineEndpoint, UsageModelKind } from "@shared/core";
import { zEventSplitsPathParams } from "./schema/inputs.ts";

export default defineEndpoint({
    meta: {
        displayName: "Get Event Betting Splits",
        summary: "Get public betting splits (money vs tickets) for an event.",
        description:
            "Get public betting splits for one event by its event id \u2014 the share of bets (tickets) versus the share of money wagered on each side, market by market. Reveals where the public and the sharp money diverge.",
        docsUrl: "https://lumify.ai/docs",
        categories: ["sports-betting"],
    },
    request: { method: "GET", path: "/events/{event_id}/splits" },
    input: { schema: { pathParams: zEventSplitsPathParams } },
    usage: {
        /** One credit per call against the account's Lumify credit pool. */
        model: {
            kind: UsageModelKind.PER_CALL,
            label: "splits reads",
            consumes: { credit: "default", amount: 1 },
        },
    },
});
