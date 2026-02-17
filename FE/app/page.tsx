import { UsersOnly } from "@/components/features/auth/auth-guards";
import LogoutButton from "@/components/features/auth/logout-button";

export default async function Home() {
  return (
    <UsersOnly>
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
          <LogoutButton />
        </main>
      </div>
    </UsersOnly>
  );
}
