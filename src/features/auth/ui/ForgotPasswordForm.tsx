import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { Button } from "shared/ui";

interface ForgotPasswordFormProps {
  setForgotPassword: (value: boolean) => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  setForgotPassword,
}) => {
  const [emailForReset, setEmailForReset] = useState("");

  const handlePasswordReset = () => {
    console.log("Reset for:", emailForReset);
    // Здесь можешь добавить логику API-запроса для восстановления пароля
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-500 mb-1">
        ИНН
      </label>
      <input
        type="text"
        value={emailForReset}
        onChange={(e) => setEmailForReset(e.target.value)}
        className="w-full border border-[#A8CCEF] rounded-lg px-4 py-2 text-[14px] focus:outline-none"
        placeholder="Введите ИНН"
      />

      <Button
        onClick={handlePasswordReset}
        className="w-full bg-[#4B84F4] text-white font-semibold rounded-md hover:bg-[#6b9cfd]"
      >
        Отправить
      </Button>

      <Button
        variant="outline"
        onClick={() => setForgotPassword(false)}
        className="w-full border-gray-500 hover:bg-gray-100 flex items-center justify-center gap-2"
      >
        <ArrowLeft size={18} />
        Назад
      </Button>
    </div>
  );
};
