// src/pages/login/LoginPage.tsx

import { LoginForm } from "features/auth";
import React from "react";
import { cn } from "shared/lib/utils"; 



export const LoginPage: React.FC = () => {
  return (
    <div className={cn("flex justify-center items-center h-screen bg-gray-50")}>
      <div className="max-w-md w-full p-6">
        <LoginForm />
      </div>
    </div>
  );
};
