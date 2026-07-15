"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function SessionGuard() {
  const pathname = usePathname();

  useEffect(() => {
    const checkSession = () => {
      fetch('/api/auth/session')
        .then(res => res.json())
        .then(session => {
          if (!session || Object.keys(session).length === 0) {
            window.location.replace('/login');
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

  return null;
}
