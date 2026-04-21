import type { Response } from "express";

type SafeParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string } };

type SafeParseSchema<T> = {
  safeParse: (input: unknown) => SafeParseResult<T>;
};

export function parseRequest<T>(
  schema: SafeParseSchema<T>,
  input: unknown,
  res: Response,
  errorCode: string,
): T | null {
  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    res.status(400).json({ error: errorCode, message: parsed.error.message });
    return null;
  }

  return parsed.data;
}
