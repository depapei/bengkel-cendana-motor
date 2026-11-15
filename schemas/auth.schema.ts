import { z } from "zod";
import { requiredString } from "./common";

export const loginSchema = z.object({
  username: requiredString("Username"),
  password: requiredString("Password"),
});

export type LoginInput = z.infer<typeof loginSchema>;
