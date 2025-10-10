import React, { useState } from "react"
import {
  Field,
  FieldDescription,
} from "shared/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "shared/ui/input-otp"

interface PinInputProps {
  onComplete?: (pin: string) => void
  onClose?: () => void
}

export const PinInput: React.FC<PinInputProps> = ({ onComplete }) => {
  const [value, setValue] = useState("")

  const handleChange = (val: string) => {
    setValue(val)
    if (val.length === 4) {
      onComplete?.(val)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.length === 4) onComplete?.(value)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
      <Field className="w-full flex flex-col items-center ">
        <InputOTP
          maxLength={4}
          id="pin"
          onChange={handleChange}
          className="flex justify-center"
        >
          <InputOTPGroup className="gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="w-12 h-12 text-xl rounded-md border border-input shadow-sm flex items-center justify-center transition-colors data-[active]:ring-2 data-[active]:ring-primary"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <FieldDescription className="text-sm text-muted-foreground text-center">
          Введите 4-значный PIN-код
        </FieldDescription>
      </Field>


    </form>
  )
}
