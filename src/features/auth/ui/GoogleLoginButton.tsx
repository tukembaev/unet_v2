import { Chrome } from "lucide-react";

import { buildGoogleOAuthUrlOrThrow, getGoogleOAuthClientId } from "../lib/google-oauth";
import { Button } from "shared/ui";
import { cn } from "shared/lib/utils";
import { toast } from "sonner";

const btnClass = cn(
  "h-12 w-full justify-between rounded-xl bg-white px-[18px] py-3 text-[15px] font-semibold shadow-sm"
);

export function GoogleLoginButton() {
  const handleLogin = () => {
    try {
      if (!getGoogleOAuthClientId()) {
        toast.error("Не настроен Google OAuth", {
          description:
            "Задайте VITE_GOOGLE_CLIENT_ID в .env.local и перезапустите dev-сервер.",
        });
        return;
      }
      window.location.href = buildGoogleOAuthUrlOrThrow();
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Не удалось открыть вход через Google"
      );
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className={btnClass}
      onClick={handleLogin}
    >
      <span>Корпоративная почта</span>
      <Chrome className="h-[22px] w-[22px] shrink-0" aria-hidden strokeWidth={2} />
    </Button>
  );
}
