# Права доступа (permissions)

## Источник

`GET /users/me` → **`permissions: string[]`**.

## Учебное управление (вкладки)

| Слаг | Вкладка |
|------|---------|
| `education_department:kinds` | Семейства |
| `education_department:disciplines` | Дисциплины |
| `education_department:reports` | Отчеты |
| `education_department:dispatch` | Диспетчерская |
| `education_department:workload` | Нагрузка |

Доступ к странице `/education-management` — если есть **хотя бы одно** из прав выше. Вкладки показываются только при наличии соответствующего слага.

## Структура — IT

| Слаг | Раздел |
|------|--------|
| `it:department` | IT департамент (`/structure/it-department`) |
| `kpi:reports` | Отчеты KPI (`/kpi-reports`) |

## Прочие модули

| Слаг | Назначение |
|------|------------|
| `work_plan` | РУП, силлабусы |
| `streams` | Потоки |
| `discipline_department` | Дисциплины кафедры (отдельный раздел) |

## Маршруты и навбар

- **`ROUTE_PERMISSION_RULES`** — какой URL требует какое право (или `anyOf` для `/education-management`).
- **`widgets/navbar/config/navigation.ts`** — пункты меню с теми же слаги.
- Документооборот и отчётность по задачам без отдельных прав — всем авторизованным.

Код: `hasPermission`, `AccessGuard`, `filterNavigationForPermissions`.
