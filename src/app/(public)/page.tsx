import { db } from "@/lib/db";
import { getCmsSettings } from "@/lib/cms-config";
import { LandingPageRenderer } from "@/components/public/LandingPageRenderer";
import { LandingPageConfig } from "@/types/landing-page";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const cmsSettings = await getCmsSettings();

  const homePage = await db.pagina.findUnique({
    where: { slug: "home" },
  });

  let configToRender: LandingPageConfig = cmsSettings.homeLanding;

  if (homePage?.landingPageConfig) {
    try {
      configToRender = JSON.parse(homePage.landingPageConfig);
    } catch {
      configToRender = cmsSettings.homeLanding;
    }
  }

  return (
    <main className="min-h-screen w-full flex flex-col py-8 bg-white dark:bg-slate-950 transition-colors">
      <LandingPageRenderer config={configToRender} />
    </main>
  );
}
