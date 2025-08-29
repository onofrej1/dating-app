"use client";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Dashboard() {
  const { data, isPending } = useSession();
  const router = useRouter();

  const signUserOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/signin");
        },
      },
    });
  };

  const userInicials = data?.user.name.charAt(0);

  return (
    <div className="p-6">
      <h2 className="text-3xl text-bold my-3">Dashboard page</h2>
      {isPending ? (
        <div>Loading</div>
      ) : data?.user ? (
        <p className="pb-3">
          Logged in user: {data?.user.name} - {data?.user.email}
          {data?.user.image && (
            <Avatar>
            <AvatarImage src={data.user.image} alt="@shadcn" />
            <AvatarFallback>{userInicials}</AvatarFallback>
          </Avatar>
          )}
          <Button onClick={signUserOut}>Logout</Button>
        </p>
      ) : (
        <Link href="/signin">Signin</Link>
      )}
    </div>
  );
}
