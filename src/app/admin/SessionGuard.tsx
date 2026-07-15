"use client";

import { useEffect } from "react";

export default function SessionGuard() {
  useEffect(() => {
    // Quando o componente for montado (mesmo via cache do botão Voltar),
    // verificamos silenciosamente se a sessão ainda existe.
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(session => {
        if (!session || Object.keys(session).length === 0) {
          // Se não houver sessão ativa, forçamos o redirecionamento
          window.location.replace('/login');
        }
      })
      .catch(() => {
        window.location.replace('/login');
      });
  }, []);

  return null;
}
