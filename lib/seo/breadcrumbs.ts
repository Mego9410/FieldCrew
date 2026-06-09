import { getSiteUrl } from "@/lib/site";

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function buildBreadcrumbList(items: BreadcrumbItem[]) {
  const baseUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.path}`,
    })),
  };
}

export function buildDocsBreadcrumbs(currentPath: string, pageTitle: string) {
  const items: BreadcrumbItem[] = [{ name: "Home", path: "/" }];

  if (currentPath === "/docs") {
    return buildBreadcrumbList([...items, { name: "Documentation", path: "/docs" }]);
  }

  items.push({ name: "Documentation", path: "/docs" });
  items.push({ name: pageTitle, path: currentPath });

  return buildBreadcrumbList(items);
}

export function buildBlogPostBreadcrumbs(slug: string, title: string) {
  return buildBreadcrumbList([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: title, path: `/blog/${slug}` },
  ]);
}

export function buildMoneyPageBreadcrumbs(path: string, title: string) {
  return buildBreadcrumbList([
    { name: "Home", path: "/" },
    { name: "HVAC Solutions", path: "/solutions/hvac" },
    { name: title, path },
  ]);
}
