import { rest } from "msw";

export const serverHandlers = [
  rest.get("/api/time-entries", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]));
  }),
];