## Простой пример композиции (названия компонентов):

# Shared Layer (общие UI и утилиты):
  Button
  Input
  FormField (типизированная обертка для react-hook-form)


# Entities Layer (бизнес-сущность "User"):
  UserCard (UI для отображения данных пользователя)
  UserService (API для получения данных пользователя)


# Features Layer (фича "Edit User"):
  EditUserForm (форма редактирования профиля)
  useEditUser (хук с логикой формы и API-запросов)


# Widgets Layer (сложный UI-блок "User Profile Widget"):
  UserProfileWidget (комбинирует UserCard и EditUserForm)

# Pages Layer (страница "Profile"):
  ProfilePage (собирает UserProfileWidget, добавляет layout)

# Композиция (сверху вниз):
Pages: ProfilePage рендерит UserProfileWidget, добавляя layout и роутинг.
  Widgets: UserProfileWidget компонует UserCard и EditUserForm в единый блок.
    Entities: UserCard использует Button для отображения данных.
    Features: EditUserForm использует FormField и UserService для отправки данных.
        Shared: Button и Input используются в FormField.



