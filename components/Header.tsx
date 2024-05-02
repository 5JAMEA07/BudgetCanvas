// /components/Header.tsx
"use client";
import { useUser, useClerk } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header className="flex items-center justify-between bg-gray-100 p-4">
      {isSignedIn ? (
        <>
          <h1 className="text-xl font-bold">
            Hello, {user.firstName} {user.lastName}!
          </h1>
          <Button
            onClick={handleSignOut}
            className="bg-[#CBDCE0] hover:bg-[#b3c2c4] text-gray-800 font-bold py-2 px-4 rounded"
          >
            Sign Out
          </Button>
        </>
      ) : (
        <h1 className="text-xl font-bold">Welcome, Guest!</h1>
      )}
    </header>
  );
}