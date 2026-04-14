import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "app/providers/routes";
import { googleAuthRequest } from "../model/api";
import { consumeExpectedGoogleNonce } from "../lib/google-oauth";
import { getHttpErrorMessage } from "shared/lib/http-error";
import { toast } from "sonner";

/**
 * После редиректа Google в URL есть `#id_token=...` — обмениваем на сессию UNET.
 * Модульные флаги нужны из‑за React Strict Mode (двойной mount): hash очищается один раз,
 * второй проход всё ещё видит токен в памяти и не дублирует запрос.
 */
let googleOAuthTokenFromHash: string | null = null;
let googleOAuthExchangeStarted = false;

export function useGoogleOAuthCallback() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const oauthError = hashParams.get("error");
    if (oauthError) {
      const desc = hashParams.get("error_description") ?? oauthError;
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname + window.location.search
      );
      toast.error("Вход через Google отменён", { description: desc });
      return;
    }

    const expectedNonce = consumeExpectedGoogleNonce();
    const nonceFromHash = hashParams.get("nonce");
    if (expectedNonce && nonceFromHash && expectedNonce !== nonceFromHash) {
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname + window.location.search
      );
      toast.error("Не удалось подтвердить Google-сессию", {
        description: "Ошибка nonce. Повторите вход через Google.",
      });
      return;
    }

    const idTokenFromHash = hashParams.get("id_token");
    const accessTokenFromHash = hashParams.get("access_token");
    const fromHash = idTokenFromHash ?? accessTokenFromHash;
    if (fromHash) {
      googleOAuthTokenFromHash = fromHash;
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname + window.location.search
      );
    }

    const idToken = googleOAuthTokenFromHash;
    if (!idToken) return;

    if (googleOAuthExchangeStarted) return;
    googleOAuthExchangeStarted = true;

    void (async () => {
      try {
        setProcessing(true);
        await googleAuthRequest(idToken);
        googleOAuthTokenFromHash = null;
        await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        toast.success("Вход через Google выполнен");
        navigate(ROUTES.HOME);
      } catch (err) {
        googleOAuthExchangeStarted = false;
        googleOAuthTokenFromHash = null;
        toast.error("Не удалось войти через Google", {
          description: getHttpErrorMessage(
            err,
            "Проверьте настройки OAuth или войдите по ПИН."
          ),
        });
      } finally {
        setProcessing(false);
      }
    })();
  }, [navigate, queryClient]);

  return { processing };
}
