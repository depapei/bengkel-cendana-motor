import { route } from "@/server/http/handler";

export const GET = route(async ({ user }) => user);
