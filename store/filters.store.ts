import { create } from 'zustand';

import type { EventFilter } from '@/types';

type FiltersState = {
  query: string;
  filter: EventFilter;
  setQuery: (query: string) => void;
  setFilter: (filter: EventFilter) => void;
  reset: () => void;
};

export const useFiltersStore = create<FiltersState>((set) => ({
  query: '',
  filter: 'all',
  setQuery: (query) => set({ query }),
  setFilter: (filter) => set({ filter }),
  reset: () => set({ query: '', filter: 'all' }),
}));
