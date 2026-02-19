import { GuestsOnly } from "@/features/auth/auth-guards";
import { LoginForm } from "@/features/auth/login-form";

export default async function LoginPage() {
  return (
    <GuestsOnly>
      <LoginForm />
    </GuestsOnly>
  );
}
