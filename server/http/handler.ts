import "server-only";
import { unstable_rethrow } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";
import { z, ZodError } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { MESSAGE, UNIQUE_FIELD_LABEL } from "@/constants/messages";
import type { UserRole } from "@/constants/user-role";
import type { ApiErrorBody } from "@/types/common";
import type { SessionUser } from "@/types/models";
import { requireUser } from "../auth";
import { AppError } from "./errors";

type Params = Record<string, string>;
type HandlerContext<P extends Params> = { params: Promise<P> };

interface PublicCtx<P extends Params> {
  req: NextRequest;
  params: P;
}
interface AuthedCtx<P extends Params> extends PublicCtx<P> {
  user: SessionUser;
}

/**
 * Pembungkus route handler: cek sesi + role, ubah hasil jadi JSON,
 * dan ubah error (AppError / Zod / Prisma) jadi response yang konsisten.
 */
export function route<P extends Params = Params>(
  handler: (ctx: AuthedCtx<P>) => Promise<unknown>,
  options: { roles?: UserRole[] } = {},
) {
  return publicRoute<P>(async (ctx) => handler({ ...ctx, user: await requireUser(ctx.req, options.roles) }));
}

export function publicRoute<P extends Params = Params>(handler: (ctx: PublicCtx<P>) => Promise<unknown>) {
  return async (req: NextRequest, context: HandlerContext<P>) => {
    try {
      return toResponse(await handler({ req, params: await context.params }));
    } catch (error) {
      // Error internal Next.js (mis. bail-out prerender) harus diteruskan, bukan dijadikan 500.
      unstable_rethrow(error);
      return toErrorResponse(error);
    }
  };
}

export async function parseBody<S extends z.ZodType>(req: NextRequest, schema: S): Promise<z.output<S>> {
  const body: unknown = await req.json().catch(() => ({}));
  return schema.parse(body);
}

export function parseQuery<S extends z.ZodType>(req: NextRequest, schema: S): z.output<S> {
  return schema.parse(Object.fromEntries(req.nextUrl.searchParams));
}

function toResponse(result: unknown) {
  return result instanceof Response ? result : NextResponse.json(result ?? { ok: true });
}

function errorJson(status: number, body: ApiErrorBody) {
  return NextResponse.json(body, { status });
}

function toErrorResponse(error: unknown) {
  if (error instanceof AppError) return errorJson(error.status, { message: error.message });

  if (error instanceof ZodError) {
    return errorJson(400, {
      message: error.issues[0]?.message ?? MESSAGE.validationFailed,
      errors: z.flattenError(error).fieldErrors as ApiErrorBody["errors"],
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const field = uniqueFields(error)[0];
      return errorJson(409, { message: MESSAGE.duplicate(UNIQUE_FIELD_LABEL[field] ?? "Data") });
    }
    if (error.code === "P2025") return errorJson(404, { message: MESSAGE.notFound("Data") });
    if (error.code === "P2003") return errorJson(400, { message: "Data terkait tidak ditemukan" });
  }

  console.error(error);
  return errorJson(500, { message: MESSAGE.serverError });
}

interface UniqueErrorMeta {
  target?: string[] | string;
  driverAdapterError?: {
    cause?: { table?: string; constraint?: { fields?: string[]; index?: string } };
  };
}

/**
 * Nama kolom unik yang bentrok. Driver adapter (pg) melaporkan nama index,
 * contoh "customers_phoneNumber_key" → "phoneNumber"; "brand_vehicles_name_type_key" → "name_type".
 */
function uniqueFields(error: Prisma.PrismaClientKnownRequestError): string[] {
  const meta = error.meta as UniqueErrorMeta | undefined;
  const cause = meta?.driverAdapterError?.cause;
  if (cause?.constraint?.fields) return cause.constraint.fields.map((field) => field.replace(/"/g, ""));
  if (cause?.constraint?.index) {
    return [cause.constraint.index.replace(`${cause.table ?? ""}_`, "").replace(/_key$/, "")];
  }
  const target = meta?.target ?? [];
  return Array.isArray(target) ? target : [target];
}
