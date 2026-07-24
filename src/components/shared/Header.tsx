import { getCmsSettings } from "@/lib/cms-config";
import { PublicHeader } from "./header/PublicHeader";

export default async function Header() {
  const cmsSettings = await getCmsSettings();

  return <PublicHeader config={cmsSettings.header} socialLinks={cmsSettings.socialLinks} />;
}
