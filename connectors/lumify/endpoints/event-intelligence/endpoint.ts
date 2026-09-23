import { defineEndpoint, Unit, UsageModelKind } from "@shared/core";
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
        /** 1 credit when intelligence is available — https://lumify.ai/docs
         *  (2026-09-23). A 200 with `available: false` reports
         *  `X-Credits-Used: 0`. Hooks cannot read response headers, so
         *  the body flag is the meter. Estimate assumes available (the
         *  pre-run honest max / fallback rate-card amount). */
        model: {
            kind: UsageModelKind.PER_UNIT,
            unit: Unit.RESULT,
            label: "intelligence reads",
            description: "available intelligence payloads returned",
            consumes: { credit: "default", amount: 1 },
        },
        estimate: () => ({ counts: { RESULT: 1 } }),
        evidence: ({ data, utils }) => {
            const available = utils.json.optionalGet(
                data.output,
                "$.available",
            );
            return { counts: { RESULT: available === true ? 1 : 0 } };
        },
    },
});
