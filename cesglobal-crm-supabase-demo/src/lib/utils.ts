export function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const VN_MONTHS = [
  "Th01", "Th02", "Th03", "Th04", "Th05", "Th06",
  "Th07", "Th08", "Th09", "Th10", "Th11", "Th12",
];

export function formatDateVn(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return `${d.getDate().toString().padStart(2, "0")} ${VN_MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
}

export function formatDateTimeVn(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  const date = formatDateVn(d);
  const time = `${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
  return `${date} • ${time}`;
}

export function relativeDateVn(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  const today = new Date();
  const sameDay =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();
  if (sameDay) {
    const time = `${d.getHours().toString().padStart(2, "0")}:${d
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    return `Hôm nay, ${time}`;
  }
  return formatDateTimeVn(d);
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
