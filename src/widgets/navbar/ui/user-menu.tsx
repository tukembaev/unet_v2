import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'shared/ui';
import { User, Settings, LogOut, HelpCircle } from 'lucide-react';
import { useAuthUser } from 'features/auth/model/queries';
import { useNavigate } from 'react-router-dom';

export function UserMenu() {
  // Mock user data - замените на реальные данные пользователя
  // const user = {
  //   name: 'Username',
  //   email: 'user@gmail.com',
  //   avatar: '', // Пустая строка для использования fallback
  // };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  const {data: user} = useAuthUser(); 
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all hover:opacity-80">
          <Avatar className="h-9 w-9 rounded-full`">
            <AvatarImage  src={user?.imeag} alt={user?.first_name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user?.first_name || "U U")}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.first_name}</span>
                <span className="truncate text-xs">{user?.email}</span>
         </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.first_name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Профиль</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Настройки</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Помощь</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/')} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Выйти</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

