'use client'
import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client";

export default function Welcome() {
  const { data } = useSession();
  console.log(data?.user);

  return (
    <div>
      Welcome page
      <Button>Button</Button>
    </div>
  );
}
