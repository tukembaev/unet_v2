import { LoginForm } from "features/auth";
import React from "react";
import { cn } from "shared/lib/utils";
export const LoginPage: React.FC = () => {
  return (
    <div
      className={cn(
        "flex justify-center items-center h-screen bg-cover bg-center",
        `bg-[url('shared/assets/img/loginImage.jpg')]`
      )}
    >
      <div className="max-w-md w-full p-6  rounded-2xl ">
        <LoginForm />
      </div>
    </div>
  );
};
