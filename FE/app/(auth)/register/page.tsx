import { GuestsOnly } from "@/features/auth/auth-guards";
import { RegisterForm } from "@/features/auth/signup-form";

export default async function RegisterPage() {
  return (
    <GuestsOnly>
      <RegisterForm />
    </GuestsOnly>
  );
}
