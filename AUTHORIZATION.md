# Авторизация в UNET (текущее состояние)

Документ описывает, как в приложении реализованы вход, хранение сессии, выбор профиля и контроль доступа к маршрутам.

## 1) Общая модель

- Аутентификация построена на cookie-сессии users-service (`withCredentials: true`).
- Дополнительно фронт хранит служебные данные в `localStorage`:
  - `user` (нормализованный payload логина/refresh),
  - `active_context` (`employee` или `student`),
  - `available_contexts` (доступные профили),
  - `csrf_token`.
- Для операций записи в users-service отправляется CSRF (`X-CSRF-TOKEN`/`x-csrf-token`).

Ключевые файлы:
- `src/shared/config/user_axios.ts`
- `src/shared/lib/axios-request-auth.ts`
- `src/shared/lib/axios-auth-refresh.ts`
- `src/shared/lib/refresh-token.ts`
- `src/shared/lib/auth-context.ts`

## 1.1) Главное API и что отправлять

Базовый URL users-service:
- `https://uadmin.kstu.kg/users/api/v1/`

Основные auth endpoint'ы:

1) Логин по ПИН/паролю  
- `POST users/auth`  
- body:
```json
{
  "username": "PIN",
  "password": "PASSWORD"
}
```

2) Логин через Google  
- `POST users/auth/google`  
- body:
```json
{
  "id_token": "GOOGLE_ID_OR_ACCESS_TOKEN"
}
```

3) Получить доступные профили (контексты)  
- `GET users/auth/contexts`  
- body: не нужен

4) Выбрать профиль после логина  
- `POST users/auth/context`  
- body:
```json
{
  "context": "employee"
}
```
или
```json
{
  "context": "student"
}
```

5) Logout  
- `POST users/auth/logout`  
- body: не нужен

6) Refresh сессии  
- `POST users/refresh`  
- body: пустая строка (`''` в коде)
- обязательно:
  - cookie (`withCredentials: true`)
  - header `X-CSRF-TOKEN` (из cookie `csrf_refresh_token`)

7) Восстановление пароля — шаг 1  
- `POST users/forgot-password`  
- body:
```json
{
  "username": "PIN_OR_LOGIN"
}
```

8) Восстановление пароля — шаг 2 (проверка кода)  
- `POST users/forgot-password/verify`  
- body:
```json
{
  "code": "123456"
}
```

9) Восстановление пароля — шаг 3 (сброс)  
- `POST users/forgot-password/reset`  
- body:
```json
{
  "code": "123456",
  "new_password": "NEW_PASSWORD"
}
```

## 2) Вход по ПИН/паролю

### Поток
1. Форма `LoginForm` отправляет `POST users/auth` с `username` и `password`.
2. Ответ нормализуется и сохраняется:
   - `localStorage.user`,
   - `csrf_token` (если пришёл),
   - доступные контексты (`available_contexts`),
   - активный контекст (если выбор не требуется).
3. Если бэкенд вернул `requires_context_selection = true`, показывается выбор профиля.
4. После завершения входа загружается `currentUser` и выполняется переход на `getAppHomePath()`.

Ключевые файлы:
- `src/features/auth/ui/LoginForm.tsx`
- `src/features/auth/model/api/index.ts`
- `src/features/auth/lib/parse-auth-login.ts`

## 3) Вход через Google OAuth

### Поток
1. Хук `useGoogleOAuthCallback` читает `id_token`/`access_token` из hash URL после редиректа Google.
2. Проверяется `nonce`.
3. Токен отправляется в `POST users/auth/google`.
4. Далее используется тот же разбор результата, что и для обычного логина:
   - сохранение `user/csrf/context`,
   - при необходимости выбор профиля,
   - переход на домашний маршрут.

Ключевой файл:
- `src/features/auth/hooks/useGoogleOAuthCallback.ts`

## 4) Выбор профиля (контекста)

Если у пользователя несколько ролей, требуется выбрать контекст:
- `employee`
- `student`

Выбор отправляется в `POST users/auth/context`, после чего:
- `active_context` сохраняется локально,
- обновляется `currentUser`,
- маршрутизация и права применяются в соответствии с контекстом.

Ключевые файлы:
- `src/features/auth/ui/ProfileContextPicker.tsx`
- `src/features/auth/model/api/index.ts`
- `src/shared/lib/auth-context.ts`

## 5) Интерсепторы запросов

## Request interceptor (`attachAuthRequestInterceptor`)

- Всегда включает `withCredentials = true`.
- Для всех запросов, кроме логина, добавляет `X-Profile-Context` из `active_context`.
- Для `POST/PATCH/PUT/DELETE` в users-service добавляет CSRF-заголовки, если токен есть.

Файл:
- `src/shared/lib/axios-request-auth.ts`

## Response interceptor (`attachRefreshInterceptor`)

- На `401`:
  - не трогает запросы логина (`users/auth`),
  - пытается один раз обновить сессию через refresh,
  - повторяет исходный запрос.
- При повторном `401` или провале refresh выполняет logout и редирект на `/`.

Файл:
- `src/shared/lib/axios-auth-refresh.ts`

## 6) Refresh токена/сессии

Refresh выполняется через `POST /users/refresh`:
- используется cookie `csrf_refresh_token`,
- запрос уходит с `withCredentials`,
- из ответа обновляется `localStorage.user`.

Защита от параллельных refresh:
- общий `refreshPromise` не даёт запускать несколько refresh одновременно.

При ошибке refresh:
- вызывается `performLogout()`,
- пользователь перенаправляется на `/`.

Файл:
- `src/shared/lib/refresh-token.ts`

## 7) Logout

`performLogout()` централизованно:
- очищает React Query cache,
- удаляет auth-данные из `localStorage`,
- очищает `sessionStorage`,
- ставит флаг `unet_suppress_login_auto_redirect=1`, чтобы не авто-логиниться на странице входа при ещё живой cookie-сессии.

Файл:
- `src/shared/lib/auth-utils.ts`

## 8) Защита маршрутов (AccessGuard)

`AccessGuard` ограничивает доступ к приватным роутам:
- если `currentUser` не загружен или ошибка — редирект на `ROUTES.AUTH`,
- если не выбран `active_context` — редирект на `ROUTES.AUTH`,
- для `student` разрешён только список student-маршрутов; `home` принудительно ведёт на `schedule`,
- для `employee` доступ проверяется через `canAccessPath(path, user.permissions)`.

Ключевые файлы:
- `src/app/providers/AccessGuard.tsx`
- `src/app/providers/router.tsx`
- `src/shared/lib/permissions/*`

## 9) Что считается успешной авторизацией в UI

Пользователь считается полностью авторизованным, когда одновременно выполнены условия:
- есть валидная серверная сессия (`useCurrentUser` возвращает пользователя),
- выбран профиль (`active_context`),
- (для операций записи в users-service) доступен CSRF.

После этого выполняется редирект на:
- `employee` -> `/home`
- `student` -> `/schedule`

