import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { cn } from "shared/lib";
import {
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

export interface AsyncMultiSelectProps<T> {
  /** Async function to fetch options */
  fetcher: (query?: string) => Promise<T[]>;
  /** Preload all data ahead of time */
  preload?: boolean;
  /** Function to filter options */
  filterFn?: (option: T, query: string) => boolean;
  /** Function to render each option */
  renderOption: (option: T) => React.ReactNode;
  /** Function to get the value from an option */
  getOptionValue: (option: T) => string;
  /** Function to get the display value for the selected option */
  getDisplayValue: (option: T) => React.ReactNode;
  /** Custom not found message */
  notFound?: React.ReactNode;
  /** Custom loading skeleton */
  loadingSkeleton?: React.ReactNode;
  /** Currently selected values */
  value: string[];
  /** Callback when selection changes */
  onChange: (values: string[]) => void;
  /** Label for the select field */
  label: string;
  /** Placeholder text when no selection */
  placeholder?: string;
  /** Disable the entire select */
  disabled?: boolean;
  /** Custom width for the popover */
  width?: string | number;
  /** Custom class names */
  className?: string;
  /** Custom trigger button class names */
  triggerClassName?: string;
  /** Custom no results message */
  noResultsMessage?: string;
  /** Maximum number of selected items to show before showing count */
  maxDisplayItems?: number;
  /** Maximum number of items that can be selected */
  maxItems?: number;
}

function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function AsyncMultiSelect<T>({
  fetcher,
  preload,
  filterFn,
  renderOption,
  getOptionValue,
  getDisplayValue,
  notFound,
  loadingSkeleton,
  label,
  placeholder = "Select...",
  value,
  onChange,
  disabled = false,
  width = "350px",
  className,
  triggerClassName,
  noResultsMessage,
  maxDisplayItems = 3,
  maxItems,
}: AsyncMultiSelectProps<T>) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedValues, setSelectedValues] = useState<string[]>(value);
  const [selectedOptions, setSelectedOptions] = useState<T[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, preload ? 0 : 300);
  const [originalOptions, setOriginalOptions] = useState<T[]>([]);

  useEffect(() => {
    setMounted(true);
    setSelectedValues(value);
  }, [value]);

  // Initialize selectedOptions when options are loaded and values exist
  useEffect(() => {
    if (value.length > 0 && options.length > 0) {
      const opts = options.filter((opt) => value.includes(getOptionValue(opt)));
      setSelectedOptions(opts);
    } else {
      setSelectedOptions([]);
    }
  }, [value, options, getOptionValue]);

  // Effect for fetching options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Clear options when starting search to show only loading state
        if (debouncedSearchTerm && !preload) {
          setOptions([]);
        }
        
        if (preload && originalOptions.length > 0) {
          // Use preloaded data and filter locally
          if (debouncedSearchTerm) {
            setOptions(
              originalOptions.filter((option) =>
                filterFn ? filterFn(option, debouncedSearchTerm) : true
              )
            );
          } else {
            setOptions(originalOptions);
          }
        } else {
          // Fetch from API
          const data = await fetcher(debouncedSearchTerm);
          setOriginalOptions(data);
          setOptions(data);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch options"
        );
      } finally {
        setLoading(false);
      }
    };

    // Only fetch when mounted and either not preloaded or search term changed
    if (mounted) {
      if (!preload || originalOptions.length === 0) {
        fetchOptions();
      } else if (preload && debouncedSearchTerm !== undefined) {
        fetchOptions();
      }
    }
  }, [
    mounted,
    debouncedSearchTerm,
    preload,
    filterFn,
    fetcher,
  ]);

  const handleSelect = useCallback(
    (currentValue: string) => {
      const isSelected = selectedValues.includes(currentValue);
      let newValues: string[];

      if (isSelected) {
        // Remove from selection
        newValues = selectedValues.filter((v) => v !== currentValue);
      } else {
        // Add to selection (check maxItems limit)
        if (maxItems && selectedValues.length >= maxItems) {
          return; // Don't add if max items reached
        }
        newValues = [...selectedValues, currentValue];
      }

      setSelectedValues(newValues);
      onChange(newValues);
    },
    [selectedValues, onChange, maxItems]
  );

  const handleRemove = useCallback(
    (valueToRemove: string) => {
      const newValues = selectedValues.filter((v) => v !== valueToRemove);
      setSelectedValues(newValues);
      onChange(newValues);
    },
    [selectedValues, onChange]
  );

  const handleClearAll = useCallback(() => {
    setSelectedValues([]);
    onChange([]);
  }, [onChange]);

  const renderSelectedItems = () => {
    if (selectedValues.length === 0) {
      return <span className="text-muted-foreground">{placeholder}</span>;
    }

    if (selectedValues.length <= maxDisplayItems) {
      return (
        <div className="flex flex-wrap gap-1">
          {selectedOptions.map((option) => (
            <Badge
              key={getOptionValue(option)}
              variant="secondary"
              className="text-xs"
            >
              {getDisplayValue(option)}
              <button
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRemove(getOptionValue(option));
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemove(getOptionValue(option));
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium">
          {selectedValues.length} selected
        </span>
        <button
          className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleClearAll();
            }
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClearAll();
          }}
        >
          <X className="h-3 w-3" />
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
          className={cn(
            "justify-between min-h-10 h-auto",
            disabled && "opacity-50 cursor-not-allowed",
            triggerClassName
          )}
          style={{ width: width }}
          disabled={disabled}
        >
          <div className="flex-1 text-left">
            {renderSelectedItems()}
          </div>
          <ChevronsUpDown className="opacity-50 ml-2 flex-shrink-0" size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent style={{ width: width }} className={cn("p-0", className)}>
        <Command shouldFilter={false}>
          <div className="relative border-b w-full">
            <CommandInput
              placeholder={`Search ${label.toLowerCase()}...`}
              value={searchTerm}
              onValueChange={(value) => {
                setSearchTerm(value);
              }}
            />
            {loading && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
          </div>
          <CommandList>
            {error && (
              <div className="p-4 text-destructive text-center">{error}</div>
            )}
            {loading && (loadingSkeleton || <DefaultLoadingSkeleton />)}
            {!loading && !error && options.length === 0 && (
              notFound || (
                <CommandEmpty>
                  {noResultsMessage ?? `No ${label.toLowerCase()} found.`}
                </CommandEmpty>
              )
            )}
            {!loading && !error && options.length > 0 && (
              <CommandGroup>
                {options.map((option) => {
                  const optionValue = getOptionValue(option);
                  const isSelected = selectedValues.includes(optionValue);
                  const isDisabled = Boolean(maxItems && selectedValues.length >= maxItems && !isSelected);

                  return (
                    <CommandItem
                      key={optionValue}
                      value={optionValue}
                      onSelect={() => handleSelect(optionValue)}
                      disabled={isDisabled}
                    >
                      {renderOption(option)}
                      <Check
                        className={cn(
                          "ml-auto h-3 w-3",
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

function DefaultLoadingSkeleton() {
  return (
    <CommandGroup>
      {[1, 2, 3].map((i) => (
        <CommandItem key={i} disabled>
          <div className="flex items-center gap-2 w-full">
            <div className="h-6 w-6 rounded-full animate-pulse bg-muted" />
            <div className="flex flex-col flex-1 gap-1">
              <div className="h-4 w-24 animate-pulse bg-muted rounded" />
              <div className="h-3 w-16 animate-pulse bg-muted rounded" />
            </div>
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
