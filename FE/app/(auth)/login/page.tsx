import { GuestsOnly } from "@/components/features/auth/auth-guards";
import { LoginForm } from "@/components/features/auth/login-form";

export default async function LoginPage() {
  return (
    <GuestsOnly>
      <LoginForm />
    </GuestsOnly>
  );
}
