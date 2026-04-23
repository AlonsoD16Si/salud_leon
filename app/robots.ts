import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://saludleon.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/campanas", "/modulos"],
      disallow: ["/dashboard", "/login"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
