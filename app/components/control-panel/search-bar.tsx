'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/app/components/ui/input';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    onSearch(newSearchTerm);
  };

  return (
    <div className="relative h-8.5 flex-1">
      <Search className="absolute top-1/2 left-3 w-4 -translate-y-1/2 transform gap-2 text-muted-foreground" />
      <Input
        placeholder="Search"
        value={searchTerm}
        onChange={handleSearchTermChange}
        className="h-8.5 flex-1 rounded-none border border-border bg-secondary pl-10 shadow-none focus-visible:border-border focus-visible:ring-0"
      />
    </div>
  );
}
