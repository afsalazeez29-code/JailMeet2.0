'use client';

import { Search } from 'lucide-react';

import s from './NavbarSearch.module.css';

type NavbarSearchProps = {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
};

export default function NavbarSearch({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search',
}: NavbarSearchProps) {
  return (
    <form
      className={s.searchForm}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(value ?? '');
      }}
      role="search"
    >
      <Search
        aria-hidden="true"
        className={s.searchIcon}
        size={16}
      />
      <input
        aria-label={placeholder}
        className={s.searchInput}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        type="search"
        value={value}
      />
    </form>
  );
}
