type PathParams = Record<string, string | number>;

/** Mengisi parameter `:nama` pada path enum, contoh buildUrl(ApiEndpoint.OrderDetail, { id }). */
export function buildUrl(path: string, params: PathParams = {}): string {
  return path.replace(/:(\w+)/g, (_, key: string) => {
    const value = params[key];
    if (value === undefined) throw new Error(`Parameter "${key}" belum diisi untuk ${path}`);
    return encodeURIComponent(String(value));
  });
}
