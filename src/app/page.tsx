"use client";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/user-store";
import { useEffect } from "react";

export default function Home() {
  const { name, email, userName, profileImage, setUserInfo } = useUserStore();

  useEffect(() => {
    console.log(name, email, userName, profileImage);
  }, []);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background">
      <h1 className="text-2xl font-semibold">Prism</h1>
      <br />
      <h1 className="text-2xl font-semibold">{name.toUpperCase()}</h1>
      <br />
      <h1 className="text-2xl font-semibold">{email.toLowerCase()}</h1>
      <br />
      <h1 className="text-2xl font-semibold">{userName}</h1>
      <br />
      <Button className="corner-squircle"
        onClick={() =>
          setUserInfo({
            name: "Vaibhav Samdani",
            email: "Vaibhavsamdani.dev@gmail.com",
            profileImage: "",
            userName: "vaibhav-samdani",
          })
        }
      >
        Click Me
      </Button>
    </div>
  );
}
