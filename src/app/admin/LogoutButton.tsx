"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex w-full items-center gap-3 px-3 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-left"
    >
      <LogOut className="h-5 w-5" />
      Sair do Sistema
    </button>
  );
}
