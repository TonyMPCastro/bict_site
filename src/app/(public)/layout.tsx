import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { getCmsSettings } from "@/lib/cms-config";
import { FloatingWhatsApp } from "@/components/shared/FloatingWhatsApp";

export const dynamic = 'force-dynamic';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cmsSettings = await getCmsSettings();

  return (
    <>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <FloatingWhatsApp config={cmsSettings.whatsApp} />
    </>
  );
}
