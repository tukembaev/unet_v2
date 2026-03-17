import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { type VirtualItem, useVirtualizer } from "@tanstack/react-virtual";
import { useUsersList } from "entities/user/model/queries";
import { UserListItem } from "entities/user/model/types";
import { cn } from "shared/lib";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
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

interface AsyncSelectProps {
  value: UserListItem | null;
  onChange: (value: UserListItem | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function AsyncSelect({
  value,
  onChange,
  placeholder = "Выбрать пользователя",
  disabled = false,
}: AsyncSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);
  
  const { data: users = [], isLoading } = useUsersList();

  const filteredUsers = users.filter((user) => {
    const searchLower = search.toLowerCase();
    return (
      user.full_name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    );
  });

  const virtualizer = useVirtualizer({
    count: filteredUsers.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => 56,
    overscan: 8,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  const virtualUsers = useMemo((): Array<{ virtual: VirtualItem; user: UserListItem }> => {
    return virtualItems.map((v: VirtualItem) => ({
      virtual: v,
      user: filteredUsers[v.index],
    }));
  }, [virtualItems, filteredUsers]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={value.avatar_url || value.avatar} />
                <AvatarFallback className="text-xs">
                  {getInitials(value.full_name)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{value.full_name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
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
          <CommandList ref={listRef as any}>
            <CommandEmpty>
              {isLoading ? "Загрузка..." : "Пользователи не найдены"}
            </CommandEmpty>
            <CommandGroup>
              <div style={{ height: totalSize, position: "relative" }}>
                {virtualUsers.map(({ virtual, user }: { virtual: VirtualItem; user: UserListItem }) => (
                  <div
                    key={user.user_id}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${virtual.start}px)`,
                    }}
                  >
                    <CommandItem
                      value={user.user_id}
                      onSelect={() => {
                        onChange(user.user_id === value?.user_id ? null : user);
                        setOpen(false);
                      }}
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
                          value?.user_id === user.user_id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  </div>
                ))}
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
