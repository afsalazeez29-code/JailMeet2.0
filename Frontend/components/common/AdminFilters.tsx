'use client';

import { FormEvent, useEffect, useState } from 'react';
import { AnimatedButtonText } from '@components/common/AnimatedButtonText';

type FilterOption = {
  label: string;
  value: string;
};

type AdminFiltersProps = {
  search: string;
  onSearchChange: (search: string) => void;
  selects?: Array<{
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  }>;
};

export default function AdminFilters({
  onSearchChange,
  search,
  selects = [],
}: AdminFiltersProps) {
  const [draftSearch, setDraftSearch] = useState(search);

  useEffect(() => {
    setDraftSearch(search);
  }, [search]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearchChange(draftSearch.trim());
  };

  return (
    <form className="card mb-3" onSubmit={handleSubmit}>
      <div className="card-body">
        <div className="row">
          <div className="col-md-4 mb-2">
            <input
              className="form-control"
              onChange={(event) => setDraftSearch(event.target.value)}
              placeholder="Search name or email"
              type="search"
              value={draftSearch}
            />
          </div>
          {selects.map((select) => (
            <div className="col-md-3 mb-2" key={select.label}>
              <select
                className="form-control"
                onChange={(event) => select.onChange(event.target.value)}
                value={select.value}
              >
                {select.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <div className="col-md-2 mb-2">
            <button className="btn btn-primary w-100" type="submit">
              <AnimatedButtonText>Search</AnimatedButtonText>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
