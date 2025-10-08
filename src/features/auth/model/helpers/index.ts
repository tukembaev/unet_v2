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

    const userRaw = localStorage.getItem("user");
    if (!userRaw) return false;

    const user = JSON.parse(userRaw);

    // Учитываем, что pin может быть как в user.pin или user.user.pin
    const storedPin: string | undefined = user.pin || user.user?.pin;
    if (!storedPin) return false;

    return storedPin === hashedPin;
  } catch (error) {
    console.error("Ошибка проверки пин-кода:", error);
    return false;
  }
}