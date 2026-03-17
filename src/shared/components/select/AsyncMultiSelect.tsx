import { Check, ChevronsUpDown, X } from "lucide-react";
import { useState } from "react";
import { useUsersList } from "entities/user/model/queries";
import { UserListItem } from "entities/user/model/types";
import { cn } from "shared/lib";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "shared/ui";

interface AsyncMultiSelectProps {
  value: UserListItem[];
  onChange: (value: UserListItem[]) => void;
  placeholder?: string;
  disabled?: boolean;
  maxDisplayItems?: number;
}

export function AsyncMultiSelect({
  value,
  onChange,
  placeholder = "Выбрать пользователей",
  disabled = false,
  maxDisplayItems = 2,
}: AsyncMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  
  const { data: users = [], isLoading } = useUsersList();

  const filteredUsers = users.filter((user) => {
    const searchLower = search.toLowerCase();
    return (
      user.full_name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    );
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSelect = (user: UserListItem) => {
    const isSelected = value.some((v) => v.user_id === user.user_id);
    if (isSelected) {
      onChange(value.filter((v) => v.user_id !== user.user_id));
    } else {
      onChange([...value, user]);
    }
  };

  const handleRemove = (userId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(value.filter((v) => v.user_id !== userId));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange([]);
  };

  const renderSelectedItems = () => {
    if (value.length === 0) {
      return <span className="text-muted-foreground">{placeholder}</span>;
    }

    if (value.length <= maxDisplayItems) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((user) => (
            <Badge
              key={user.user_id}
              variant="secondary"
              className="text-xs gap-1"
            >
              <Avatar className="h-4 w-4">
                <AvatarImage src={user.avatar_url || user.avatar} />
                <AvatarFallback className="text-[8px]">
                  {getInitials(user.full_name)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate max-w-[100px]">{user.full_name}</span>
              <button
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={(e) => handleRemove(user.user_id, e)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          Выбрано: {value.length}
        </span>
        <button
          className="ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          onClick={handleClearAll}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between min-h-10 h-auto"
          disabled={disabled}
        >
          <div className="flex-1 text-left">{renderSelectedItems()}</div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="p-0 w-[var(--radix-popover-trigger-width)]" 
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Поиск пользователя..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList className="max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <CommandEmpty>Загрузка...</CommandEmpty>
            ) : filteredUsers.length === 0 ? (
              <CommandEmpty>Пользователи не найдены</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredUsers.map((user) => {
                  const isSelected = value.some((v) => v.user_id === user.user_id);
                  return (
                    <CommandItem
                      key={user.user_id}
                      value={user.user_id}
                      onSelect={() => handleSelect(user)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar_url || user.avatar} />
                          <AvatarFallback className="text-xs">
                            {getInitials(user.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.full_name}</span>
                          <span className="text-sm text-muted-foreground">
                            {user.email}
                          </span>
                        </div>
                      </div>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
