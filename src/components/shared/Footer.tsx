import { getCmsSettings } from "@/lib/cms-config";
import { PublicFooter } from "./footer/PublicFooter";

export default async function Footer() {
  const cmsSettings = await getCmsSettings();

  return <PublicFooter config={cmsSettings.footer} socialLinks={cmsSettings.socialLinks} />;
}
