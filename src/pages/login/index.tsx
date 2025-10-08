// src/pages/login/LoginPage.tsx

import { LoginForm } from "features/auth";
import React from "react";
import { cn } from "shared/lib/utils"; 
import loginImage from "shared/assets/img/loginImage.jpg";


export const LoginPage: React.FC = () => {
  return (
    <div
    style={{
    backgroundImage: `url(${loginImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
    className={cn("flex justify-center items-center h-screen bg-gray-50")}>
      <div className="max-w-md w-full p-6">
        <LoginForm />
      </div>
    </div>
  );
};
