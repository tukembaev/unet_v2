
import React from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "shared/ui/input-otp";

// Обрати внимание на путь — зависит от того, как ты настроил shadcn в проекте

interface PinInputProps {
  length?: number;
  onComplete?: (pin: string) => void;
  className?: string;
}

export const PinInput: React.FC<PinInputProps> = ({
  length = 4,
  onComplete,
  className = "",
}) => {
  const handleChange = (value: string) => {
    if (value.length === length) {
      onComplete?.(value);
    }
  };

  return (
    <InputOTP
      maxLength={length}
      onChange={handleChange}
      className={className}
    >
      <InputOTPGroup>
        {Array.from({ length }).map((_, idx) => (
          <InputOTPSlot key={idx} index={idx} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
};
