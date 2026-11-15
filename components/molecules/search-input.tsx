"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { Input } from "antd";
import { SEARCH_DEBOUNCE_MS } from "@/constants/app";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  autoFocus?: boolean;
}

/** Input pencarian dengan debounce. */
export function SearchInput({ placeholder = "Cari...", onSearch, autoFocus }: SearchInputProps) {
  const [value, setValue] = useState("");
  const emitSearch = useEffectEvent((text: string) => onSearch(text));

  useEffect(() => {
    const timer = setTimeout(() => emitSearch(value.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <Input.Search
      allowClear
      autoFocus={autoFocus}
      placeholder={placeholder}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onSearch={setValue}
      className="max-w-md"
    />
  );
}
