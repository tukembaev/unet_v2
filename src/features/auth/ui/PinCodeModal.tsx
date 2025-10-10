// features/auth/pin/ui/PinModal.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "shared/ui/dialog";
import { Button } from "shared/ui";
import { checkPin } from "../model/helpers";
import { PinInput } from "./PinInput";



interface PinModalProps {
  open: boolean;
  onClose: () => void;
}

export const PinModal: React.FC<PinModalProps> = ({ open, onClose }) => {
  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (checkPin(pin)) {
      toast.success("Успешный вход в систему", {
        description: "Добро пожаловать!",
      });
      onClose();
      navigate("/home");
    } else {
      toast.error("Неверный ПИН-код", {
        description: "Пожалуйста, попробуйте снова.",
      });
      setPin("");
    }
  };

  const handleClose = () => {
    setPin("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="p-6 w-full/max-w-md ">
        <DialogHeader>
          <DialogTitle>Введите ПИН-код</DialogTitle>
        </DialogHeader>

        <div className="flex justify-center mb-2">
          <PinInput  onComplete={setPin} />
        </div>

        <div className="flex justify-between ">
          <Button variant="outline" onClick={handleClose}>
            Закрыть
          </Button>
          <Button className="bg-[#4b84f4] text-white" onClick={handleSubmit} disabled={pin.length < 4}>
            Войти
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
