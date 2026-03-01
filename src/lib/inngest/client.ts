import { Inngest } from "inngest";

export const inngest = new Inngest({
    id: "pet-manager",
    eventKey: process.env.INNGEST_EVENT_KEY || "local"
});
