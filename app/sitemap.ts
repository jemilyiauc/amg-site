import type { MetadataRoute } from "next";

const BASE_URL = "https://www.artestmanagementgroup.com";

const routes = [""];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
