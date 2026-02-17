import { GuestsOnly } from "@/components/features/auth/auth-guards";
import { RegisterForm } from "@/components/features/auth/signup-form";

export default async function RegisterPage() {
  return (
    <GuestsOnly>
      <RegisterForm />
    </GuestsOnly>
  );
}
