// features/auth/pin/ui/PinModal.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "shared/ui/dialog";

import { Button } from "shared/ui";
import { checkPin } from "../model/helpers";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PinInput } from "./pinInput";


export const PinModal = ({ open, onClose,  }: any) => {
  const [pin, setPin] = useState("");
  const navigate = useNavigate();
  const handleSubmit = () => {
    if (checkPin(pin)) {
        toast.success("Успешный вход в систему", { description: `Добро пожаловать!`})
        onClose();
        navigate("/home");
    } else {
        toast.error("Неверный ПИН-код", { description: "Пожалуйста, попробуйте снова."});
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-8 w-full/max-w-md">
        <DialogHeader>
          <DialogTitle>Введите ПИН-код</DialogTitle>
        </DialogHeader>

        <div className="flex justify-center mb-4">
            <PinInput length={4} onComplete={setPin} />
        </div>

        <div className="flex justify-between gap-6">
          <Button variant="outline" onClick={onClose}>Закрыть</Button>
          <Button onClick={handleSubmit}>Войти</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
