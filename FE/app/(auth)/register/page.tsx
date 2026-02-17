import { RegisterForm } from "@/components/features/auth/signup-form";
import { requireUnauth } from "@/lib/auth-utils";

export default async function RegisterPage() {
  await requireUnauth();
  return <RegisterForm />;
}
