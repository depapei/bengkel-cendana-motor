import type { Metadata } from "next";
import { LoginForm } from "@/components/organisms/login-form";
import { AuthLayout } from "@/components/templates/auth-layout";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <AuthLayout title="Selamat datang" subtitle="Masuk dengan akun Anda untuk melanjutkan.">
      <LoginForm />
    </AuthLayout>
  );
}
