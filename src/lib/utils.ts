export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function absoluteUrl(path = "/") {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://northlinebuild.com";
  return new URL(path, baseUrl).toString();
}
