export function timeAgo(date: Date | string, now = new Date()): string {
  const days = Math.floor((now.getTime() - new Date(date).getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months < 12 ? `${months} month${months > 1 ? "s" : ""} ago` : `${Math.floor(months / 12)} year(s) ago`;
}

export function shortDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
