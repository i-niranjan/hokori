import type { SocialLinkData, SocialPlatform } from "@hokori/types";
import {
  IconBrandBehance,
  IconBrandDribbble,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandYoutube,
  IconRss,
  IconWorld,
  type Icon,
} from "@tabler/icons-react";

export const PLATFORM_META: Record<
  SocialPlatform,
  { label: string; Icon: Icon }
> = {
  github: { label: "GitHub", Icon: IconBrandGithub },
  linkedin: { label: "LinkedIn", Icon: IconBrandLinkedin },
  twitter: { label: "X", Icon: IconBrandX },
  instagram: { label: "Instagram", Icon: IconBrandInstagram },
  behance: { label: "Behance", Icon: IconBrandBehance },
  dribbble: { label: "Dribbble", Icon: IconBrandDribbble },
  youtube: { label: "YouTube", Icon: IconBrandYoutube },
  website: { label: "Website", Icon: IconWorld },
  blog: { label: "Blog", Icon: IconRss },
};

export interface SocialLink {
  label: string;
  href: string;
  Icon: Icon;
}

export function getSocialLinks(links: SocialLinkData[]): SocialLink[] {
  return links.map((link) => ({
    label: PLATFORM_META[link.platform].label,
    href: link.url,
    Icon: PLATFORM_META[link.platform].Icon,
  }));
}
