"use client";
import { adminContent } from "@features/blog/admin/adminContent";
import { AdminButton, AdminField, AdminInput, AdminScreen } from "@features/blog/admin/components/AdminUi";
import { blogAdminApi } from "@features/blog/api/blogAdminApi";
import { validateLogin, type FieldErrors } from "@features/blog/lib/blogValidation";
import { useState, type FormEvent } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors<"email" | "password">>({});
  const [loginError, setLoginError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const copy = adminContent.login;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateLogin(email, password);
    setErrors(nextErrors);
    setLoginError(null);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    setSubmitting(true);
    try {
      await blogAdminApi.signIn(email.trim(), password);
    } catch {
      setLoginError(copy.error);
      setSubmitting(false);
    }
  };

  return (
    <AdminScreen eyebrow={copy.eyebrow} title={copy.title} message={copy.subtitle}>
      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
        <AdminField label={copy.email} error={errors.email}>
          <AdminInput
            type="email"
            name="email"
            autoComplete="username"
            value={email}
            error={Boolean(errors.email)}
            onChange={(event) => setEmail(event.target.value)}
          />
        </AdminField>
        <AdminField label={copy.password} error={errors.password}>
          <AdminInput
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            error={Boolean(errors.password)}
            onChange={(event) => setPassword(event.target.value)}
          />
        </AdminField>
        {loginError && (
          <p role="alert" className="text-sm font-medium text-[#e5484d]">
            {loginError}
          </p>
        )}
        <AdminButton type="submit" loading={submitting} className="mt-1 w-full py-3">
          {copy.submit}
        </AdminButton>
      </form>
    </AdminScreen>
  );
}
