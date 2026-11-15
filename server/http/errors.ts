import { MESSAGE } from "@/constants/messages";

export class AppError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export const badRequest = (message: string) => new AppError(400, message);
export const unauthorized = () => new AppError(401, MESSAGE.unauthorized);
export const forbidden = () => new AppError(403, MESSAGE.forbidden);
export const notFound = (entity: string) => new AppError(404, MESSAGE.notFound(entity));
export const conflict = (message: string) => new AppError(409, message);
