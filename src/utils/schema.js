import { z } from "zod";

export const exampleSchema = z.object({
  name: z.string().min(3).max(255),
})