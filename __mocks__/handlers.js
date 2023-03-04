import { rest } from "msw";
import { getTimeEntries, addTimeEntry, deleteTimeEntry } from "./src/api/time-entries";

// Use the exported functions in your mock handlers

export const handlers = [
  // Handler for fetching all time entries
  rest.get("/time-entries", async (req, res, ctx) => {
    const response = await getTimeEntries();
    if (response.success) {
      return res(ctx.status(200), ctx.json(response.data));
    } else {
      return res(ctx.status(response.error.statusCode), ctx.json({ message: response.error.message }));
    }
  }),

  // Handler for adding a new time entry
  rest.post("/time-entries", async (req, res, ctx) => {
    const newEntry = req.body;
    const response = await addTimeEntry(newEntry);
    if (response.success) {
      return res(ctx.status(201), ctx.json(response.data));
    } else {
      return res(ctx.status(response.error.statusCode), ctx.json({ message: response.error.message }));
    }
  }),

  // Handler for deleting a time entry
  rest.delete("/time-entries/:id", async (req, res, ctx) => {
    const id = parseInt(req.params.id);
    const response = await deleteTimeEntry(id);
    if (response.success) {
      return res(ctx.status(204));
    } else {
      return res(ctx.status(response.error.statusCode), ctx.json({ message: response.error.message }));
    }
  }),

  // Default handler for all other requests
  rest.default(async (req, res, ctx) => {
    console.error(`Unhandled request: ${req.method} ${req.url.toString()}`);
    return res(ctx.status(500), ctx.json({ message: "Unhandled request" }));
  })
];