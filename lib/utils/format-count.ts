export function formatCount(value: number): string {
  return new Intl.NumberFormat("en-NG").format(value);
}
