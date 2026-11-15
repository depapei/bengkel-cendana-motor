"use client";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { FormContainer } from "@/components/molecules/form-container";
import { FormField } from "@/components/molecules/form-field";
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
        render={(field) => <Input {...field} prefix={<UserOutlined />} autoComplete="username" autoFocus />}
      />
      <FormField
        control={control}
        name="password"
        label="Password"
        render={(field) => <Input.Password {...field} prefix={<LockOutlined />} autoComplete="current-password" />}
      />
      <Button type="primary" htmlType="submit" block loading={login.isPending}>
        Masuk
      </Button>
    </FormContainer>
  );
}
