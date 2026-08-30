"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "../lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  showSearch?: boolean;
  clearable?: boolean;
  size?: "sm" | "default" | "lg";
}

export function Combobox({
  options = [],
  value,
  defaultValue,
  onChange,
  onValueChange,
  placeholder = "Pilih opsi...",
  searchPlaceholder = "Cari opsi...",
  emptyText = "Tidak ada pilihan ditemukan.",
  disabled = false,
  className,
  triggerClassName,
  contentClassName,
  showSearch = true,
  clearable = false,
  size = "default",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState<string>(
    defaultValue || "",
  );

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  const handleSelect = (val: string) => {
    const nextVal = val === selectedValue ? (clearable ? "" : val) : val;
    if (!isControlled) {
      setInternalValue(nextVal);
    }
    onChange?.(nextVal);
    onValueChange?.(nextVal);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isControlled) {
      setInternalValue("");
    }
    onChange?.("");
    onValueChange?.("");
  };

  const sizeClasses = {
    sm: "h-8.5 text-xs px-2.5 rounded-lg",
    default: "h-10 text-sm px-3 rounded-xl",
    lg: "h-11 text-base px-3.5 rounded-xl",
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          style={{ outline: "none" }}
          className={cn(
            "group flex w-full items-center justify-between gap-2 border border-input bg-background font-normal text-foreground shadow-xs transition-colors hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
            sizeClasses[size],
            !selectedOption && "text-muted-foreground",
            triggerClassName,
            className,
          )}
        >
          <span className="flex items-center gap-2 truncate min-w-0 flex-1 text-left">
            {selectedOption?.icon}
            <span className="truncate font-medium text-foreground">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            {selectedOption?.badge && (
              <span className="ml-1.5 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                {selectedOption.badge}
              </span>
            )}
          </span>
          <div className="flex items-center gap-1 shrink-0 ml-1">
            {clearable && selectedOption && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            )}
            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-[var(--radix-popover-trigger-width)] min-w-[220px] p-0 border border-border bg-popover text-popover-foreground shadow-xl rounded-xl overflow-hidden",
          contentClassName,
        )}
        align="start"
      >
        <Command>
          {showSearch && <CommandInput placeholder={searchPlaceholder} />}
          <CommandList className="max-h-[300px] overflow-y-auto p-1.5 scrollbar-thin">
            <CommandEmpty className="py-6 text-center text-xs text-muted-foreground">
              {emptyText}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValue === option.value;
                return (
                  <CommandItem
                    key={option.value}
                    value={`${option.label} ${option.description || ""} ${option.value}`}
                    onSelect={() => handleSelect(option.value)}
                    className={cn(
                      "flex items-center justify-between gap-2.5 px-3 py-2.5 cursor-pointer rounded-lg transition-all",
                      isSelected
                        ? "bg-emerald-600 text-white font-semibold data-[selected=true]:bg-emerald-600 data-[selected=true]:text-white"
                        : "text-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {option.icon && (
                        <span
                          className={cn(
                            "shrink-0",
                            isSelected ? "text-white" : "",
                          )}
                        >
                          {option.icon}
                        </span>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span
                          className={cn(
                            "font-medium text-sm truncate",
                            isSelected ? "text-white" : "text-foreground",
                          )}
                        >
                          {option.label}
                        </span>
                        {option.description && (
                          <span
                            className={cn(
                              "text-xs leading-tight truncate mt-0.5",
                              isSelected
                                ? "text-white/80"
                                : "text-muted-foreground",
                            )}
                          >
                            {option.description}
                          </span>
                        )}
                      </div>
                    </div>
                    <Check
                      className={cn(
                        "size-4 shrink-0 transition-opacity",
                        isSelected ? "opacity-100 text-white" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
