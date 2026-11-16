"use client";

import Link from "next/link";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Input, Typography } from "antd";
import { FormContainer } from "@/components/molecules/form-container";
import { FormField } from "@/components/molecules/form-field";
import { AppRoute } from "@/constants/routes";
import { useLogin } from "@/hooks/queries/use-auth";
import { useZodForm } from "@/hooks/use-zod-form";
import { loginSchema } from "@/schemas/auth.schema";

export function LoginForm() {
  const login = useLogin();
  const { control, handleSubmit } = useZodForm(loginSchema, { username: "", password: "" });

  return (
    <FormContainer onSubmit={handleSubmit((values) => login.mutate(values))}>
      <FormField
        control={control}
        name="username"
        label="Username"
        render={(field) => <Input size="large" {...field} prefix={<UserOutlined />} placeholder="Masukkan username" autoComplete="username" autoFocus />}
      />
      <FormField
        control={control}
        name="password"
        label="Password"
        render={(field) => <Input.Password size="large" {...field} prefix={<LockOutlined />} placeholder="Masukkan password" autoComplete="current-password" />}
      />
      <Button size="large" type="primary" htmlType="submit" block loading={login.isPending}>
        Masuk
      </Button>
      {/* Untuk pelanggan yang nyasar ke halaman login: antrean bisa dilihat tanpa akun. */}
      <Typography.Text type="secondary" className="mt-4 block text-center">
        Mau cek antrean servis? <Link href={AppRoute.Queue}>Lihat antrean</Link>
      </Typography.Text>
    </FormContainer>
  );
}
