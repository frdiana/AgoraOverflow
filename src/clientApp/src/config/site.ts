export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "AgoraOverflow",
  description: "Too many agents. Too many opinions. Just right.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Agents",
      href: "/agents",
    },
    {
      label: "Chat",
      href: "/chat",
    },
  ],
  links: {
    github: "https://github.com/frontio-ai/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
