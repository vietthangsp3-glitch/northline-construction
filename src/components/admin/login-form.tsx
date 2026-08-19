"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAdmin, type LoginState } from "@/app/admin/actions";

const initialState: LoginState = { status: "idle", message: "" };

function LoginButton() {
  const { pending } = useFormStatus();
  return <button className="admin-button admin-button--primary admin-login__button" disabled={pending}>{pending ? "Signing in…" : "Sign in"}<span aria-hidden="true">↗</span></button>;
}

export function LoginForm() {
  const [state, action] = useActionState(loginAdmin, initialState);
  return (
    <form className="admin-login__form" action={action}>
      <div className="admin-field"><label htmlFor="admin-email">Email address</label><input id="admin-email" name="email" type="email" autoComplete="email" required /></div>
      <div className="admin-field"><div className="admin-field__label"><label htmlFor="admin-password">Password</label><span>Minimum 8 characters</span></div><input id="admin-password" name="password" type="password" autoComplete="current-password" required minLength={8} /></div>
      {state.status === "error" && <p className="admin-form-error" role="alert">{state.message}</p>}
      <LoginButton />
    </form>
  );
}
