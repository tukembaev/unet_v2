import { UserCard } from "entities/user";
import type { IUser, UserRole } from "entities/user/model/types";

export default function ProfilePage() {
  const mockUserRaw = {
    id: 1,
    first_name: "Мадияр",
    surname: "с.UNET",
    email: "smanovmadiyar@gmail.com",
    phone: "+996557507512",
    position: "Программный инженер",
    department: "IT-отдел",
    role: "teacher", // может быть любая строка, но мы проверим
    image:
      "https://i.pinimg.com/736x/c5/bc/11/c5bc1152a080c8e02fc2b62ff0a416b1.jpg",
  };

  // Валидируем роль
  const normalizeRole = (value: string): UserRole => {
    const allowedRoles: UserRole[] = ["student", "teacher", "employee"];
    return allowedRoles.includes(value as UserRole)
      ? (value as UserRole)
      : "employee";
  };

  const user: IUser = {
    id: mockUserRaw.id,
    first_name: mockUserRaw.first_name ?? "",
    last_name: mockUserRaw.surname ?? "",
    email: mockUserRaw.email,
    phone: mockUserRaw.phone,
    position: mockUserRaw.position,
    department: mockUserRaw.department,
    role: normalizeRole(mockUserRaw.role),
    image: mockUserRaw.image,
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Личная карточка</h1>
      <UserCard user={user} />
    </div>
  );
}
