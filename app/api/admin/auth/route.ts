import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const ADMIN_USER = process.env.ADMIN_USER || "admin";
    const ADMIN_PASS = process.env.ADMIN_PASS || "admin123";

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const response = NextResponse.json({
        success: true,
        message: "Login berhasil",
        user: { username: "Administrator", role: "Superadmin" },
      });

      // Set cookie
      response.cookies.set("admin_session", "authenticated_token_secret", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Username atau password salah!" },
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logout berhasil" });
  response.cookies.delete("admin_session");
  return response;
}
