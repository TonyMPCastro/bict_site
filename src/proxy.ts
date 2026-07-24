import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = token.role as string;
    const permissoes = (token.permissoes as string[]) || [];

    // Rotas restritas exclusivamente a Administradores ou Permissão Específica
    if (pathname.startsWith("/admin/usuarios")) {
      if (role !== "ADMIN" && !permissoes.includes("GERENCIAR_USUARIOS")) {
        return NextResponse.rewrite(new URL("/unauthorized", req.url));
      }
    }

    if (pathname.startsWith("/admin/configuracoes")) {
      if (role !== "ADMIN" && !permissoes.includes("GERENCIAR_CMS")) {
        return NextResponse.rewrite(new URL("/unauthorized", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
