import type { ProfileData } from "@hokori/types";
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  type Icon,
} from "@tabler/icons-react";

export interface SocialLink {
  label: string;
  href: string;
  Icon: Icon;
}

export function getSocialLinks(data: ProfileData): SocialLink[] {
  const links: SocialLink[] = [];
  if (data.github)
    links.push({
      label: "GitHub",
      href: `https://github.com/${data.github}`,
      Icon: IconBrandGithub,
    });
  if (data.twitter)
    links.push({
      label: "X",
      href: `https://x.com/${data.twitter}`,
      Icon: IconBrandX,
    });
  if (data.linkedin)
    links.push({
      label: "LinkedIn",
      href: `https://linkedin.com/in/${data.linkedin}`,
      Icon: IconBrandLinkedin,
    });
  if (data.instagram)
    links.push({
      label: "Instagram",
      href: `https://instagram.com/${data.instagram}`,
      Icon: IconBrandInstagram,
    });
  return links;
}
