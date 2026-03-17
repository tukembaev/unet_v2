import { Check, ChevronsUpDown, X } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useUsersList } from "entities/user/model/queries";
import { UserListItem } from "entities/user/model/types";
import { cn } from "shared/lib";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
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

const ITEM_HEIGHT = 48;
const LIST_MAX_HEIGHT = 300;

export function AsyncMultiSelect({
  value,
  onChange,
  placeholder = "Выбрать пользователей",
  disabled = false,
  maxDisplayItems = 2,
}: AsyncMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(null);

  const { data: users = [], isLoading } = useUsersList();

  const selectedIds = useMemo(
    () => new Set(value.map((v) => v.user_id)),
    [value]
  );

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
      if (selectedIds.has(user.user_id)) {
        onChange(value.filter((v) => v.user_id !== user.user_id));
      } else {
        onChange([...value, user]);
      }
    },
    [onChange, value, selectedIds]
  );

  const handleRemove = useCallback(
    (userId: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onChange(value.filter((v) => v.user_id !== userId));
    },
    [onChange, value]
  );

  const handleClearAll = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onChange([]);
    },
    [onChange]
  );

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
            <p className="py-6 text-center text-sm text-muted-foreground">
              Загрузка...
            </p>
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
                  const isSelected = selectedIds.has(user.user_id);
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
