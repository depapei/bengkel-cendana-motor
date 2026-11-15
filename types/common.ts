export type EnumMeta<T extends string> = Record<T, { label: string; color: string }>;

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ListParams {
  page?: number;
  pageSize?: number;
  q?: string;
}

export interface ApiErrorBody {
  message: string;
  errors?: Record<string, string[] | undefined>;
}

/** Kolom audit yang dikembalikan API. */
export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}
