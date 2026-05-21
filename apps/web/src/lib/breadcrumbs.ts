export const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  template: "Templates",
  templates: "Templates",
  insight: "Insights",
  insights: "Insights",
  setting: "Settings",
  settings: "Settings",
};

export function buildCrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((segment, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const label =
      routeLabels[segment] ??
      segment.charAt(0).toUpperCase() + segment.slice(1);
    return { href, label, isLast: i === segments.length - 1 };
  });
}
