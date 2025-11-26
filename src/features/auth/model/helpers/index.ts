import SHA256 from "crypto-js/sha256";
/**
 * Проверяет, совпадает ли переданный пин-код с захешированным в localStorage.
 * @param text - Введённый пользователем пин-код.
 * @returns true, если хеш совпадает с user.pin, иначе false.
 */
export function checkPin(text: string): boolean {
  if (!text) return false;
  try {
    const hashedPin = SHA256(text).toString();
    const userPin = localStorage.getItem("pin");
    if (!userPin) return false;
    const storedPin: string | undefined = userPin ;
    if (!storedPin) return false;
    return storedPin === hashedPin;
  } catch (error) {
    console.error("Ошибка проверки пин-кода:", error);
    return false;
  }
}


export const formatTeacherName = (fullName?: string) => {
  if (!fullName) return "";
  const [last, first, middle] = fullName.split(" ");
  const initials =
    [first?.[0], middle?.[0]].filter(Boolean).join(". ") + (first || middle ? "." : "");
  return `${last} ${initials}`;
};