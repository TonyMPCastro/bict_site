"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SessionGuard() {
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const checkSession = () => {
      setIsChecking(true);
      fetch('/api/auth/session')
        .then(res => res.json())
        .then(session => {
          if (!session || Object.keys(session).length === 0) {
            window.location.replace('/login');
          } else {
            setIsChecking(false);
          }
        })
        .catch(() => window.location.replace('/login'));
    };

    // Verifica assim que monta ou quando a rota muda
    checkSession();

    // Verifica quando a aba ganha foco ou quando volta do cache (bfcache)
    window.addEventListener('focus', checkSession);
    window.addEventListener('pageshow', checkSession);

    return () => {
      window.removeEventListener('focus', checkSession);
      window.removeEventListener('pageshow', checkSession);
    };
  }, [pathname]);

  if (!isChecking) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium">Verificando segurança...</p>
      </div>
    </div>
  );
}
