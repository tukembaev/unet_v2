import React, { useState, useRef, forwardRef } from "react";

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
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value.slice(-1);
    setValues(newValues);

    // автофокус на следующее поле
    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    // если все поля заполнены
    if (newValues.every((v) => v !== "")) {
      onComplete?.(newValues.join(""));
      
    }
    
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {values.map((value, i) => (
        <PinInputField
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          value={value}
          onChange={(v) => handleChange(i, v)}
          onKeyDown={(e) => handleKeyDown(e, i)}
        />
      ))}
    </div>
  );
};

// 👇 исправленный тип onChange + forwardRef
interface PinInputFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

const PinInputField = forwardRef<HTMLInputElement, PinInputFieldProps>(
  ({ value, onChange, ...props }, ref) => (
    <input
      ref={ref}
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={value}
      onChange={(e) => {
        if (/^\d*$/.test(e.target.value)) onChange(e.target.value);
      }}
      className="
        w-12 h-12 text-center text-lg font-medium
        border-2 border-gray-300 rounded-xl
        focus:border-blue-500 focus:outline-none
        transition
      "
      {...props}
    />
  )
);

PinInputField.displayName = "PinInputField";
