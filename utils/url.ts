type PathParams = Record<string, string | number>;

/** Mengisi parameter `:nama` pada path enum, contoh buildUrl(ApiEndpoint.OrderDetail, { id }). */
export function buildUrl(path: string, params: PathParams = {}): string {
  return path.replace(/:(\w+)/g, (_, key: string) => {
    const value = params[key];
    if (value === undefined) throw new Error(`Parameter "${key}" belum diisi untuk ${path}`);
    return encodeURIComponent(String(value));
  });
}

type QueryParams = Record<string, string | number | undefined>;

/** Menambahkan query string (nilai kosong diabaikan), contoh withQuery(AppRoute.Orders, { status }). */
export function withQuery(path: string, query: QueryParams): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `${path}?${qs}` : path;
}
