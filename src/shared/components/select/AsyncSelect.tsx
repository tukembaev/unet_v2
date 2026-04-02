import { Check, ChevronsUpDown, RefreshCw } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useUsersList } from "entities/user/model/queries";
import { UserListItem } from "entities/user/model/types";
import { cn } from "shared/lib";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "shared/ui";
import { SelectSkeleton } from "./SelectSkeleton";

interface AsyncSelectProps {
  value: UserListItem | null;
  onChange: (value: UserListItem | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

const ITEM_HEIGHT = 48;
const LIST_MAX_HEIGHT = 300;

export function AsyncSelect({
  value,
  onChange,
  placeholder = "Выбрать пользователя",
  disabled = false,
}: AsyncSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(null);

  const { data: users = [], isLoading, isError, refetch, isFetching } = useUsersList();

  const filteredUsers = useMemo(() => {
    if (!search) return users;
    const searchLower = search.toLowerCase();
    return users.filter(
      (user) =>
        user.full_name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower)
    );
  }, [users, search]);

  const virtualizer = useVirtualizer({
    count: filteredUsers.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 5,
  });

  const getInitials = useCallback((name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const handleSelect = useCallback(
    (user: UserListItem) => {
      onChange(user.user_id === value?.user_id ? null : user);
      setOpen(false);
    },
    [onChange, value?.user_id]
  );

  const listHeight = Math.min(
    filteredUsers.length * ITEM_HEIGHT,
    LIST_MAX_HEIGHT
  );

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
        <div className="flex flex-col">
          {/* Search input */}
          <div className="flex items-center border-b px-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4 shrink-0 opacity-50"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Поиск пользователя..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Virtualized list */}
          {isLoading ? (
            <SelectSkeleton />
          ) : isError ? (
            <div className="flex flex-col items-center gap-2 py-6">
              <p className="text-sm text-destructive">
                Ошибка загрузки пользователей
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
                className="gap-1.5"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} />
                Повторить
              </Button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Пользователи не найдены
            </p>
          ) : (
            <div
              ref={setScrollElement}
              className="overflow-y-auto overflow-x-hidden themed-scrollbar"
              style={{
                height: listHeight,
                maxHeight: LIST_MAX_HEIGHT,
                overscrollBehavior: "contain",
                WebkitOverflowScrolling: "touch",
              }}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {virtualizer.getVirtualItems().map((virtualItem) => {
                  const user = filteredUsers[virtualItem.index];
                  const isSelected = value?.user_id === user.user_id;
                  return (
                    <div
                      key={user.user_id}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                      className={cn(
                        "flex items-center gap-3 px-2 py-1.5 cursor-pointer rounded-sm text-sm select-none",
                        isSelected
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent hover:text-accent-foreground"
                      )}
                      onClick={() => handleSelect(user)}
                    >
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={user.avatar_url || user.avatar} />
                        <AvatarFallback className="text-xs">
                          {getInitials(user.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-medium truncate">
                          {user.full_name}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </span>
                      </div>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4 shrink-0",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
