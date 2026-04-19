import {create} from 'zustand';
import {JournalEntry, JournalViewMode, JournalSortBy, JournalMood} from '../types/journal';
import {storage} from '../services/storage';
import {generateId} from '../utils/id';

const JOURNAL_KEY = 'journal_entries';

function loadEntries(): JournalEntry[] {
  const raw = storage.getString(JOURNAL_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as JournalEntry[];
  } catch {
    return [];
  }
}

function saveEntries(entries: JournalEntry[]) {
  storage.set(JOURNAL_KEY, JSON.stringify(entries));
}

interface JournalStore {
  entries: JournalEntry[];
  viewMode: JournalViewMode;
  sortBy: JournalSortBy;
  searchQuery: string;
  selectedTags: string[];
  isLoading: boolean;
  error: string | null;

  loadEntries: () => void;
  createEntry: (title: string, content: string, mood?: JournalMood, tags?: string[]) => JournalEntry;
  updateEntry: (id: string, updates: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>) => void;
  deleteEntry: (id: string) => void;
  togglePin: (id: string) => void;
  setViewMode: (mode: JournalViewMode) => void;
  setSortBy: (sortBy: JournalSortBy) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTags: (tags: string[]) => void;
  getFilteredEntries: () => JournalEntry[];
  getAllTags: () => string[];
}

export const useJournalStore = create<JournalStore>((set, get) => ({
  entries: [],
  viewMode: 'list',
  sortBy: 'newest',
  searchQuery: '',
  selectedTags: [],
  isLoading: false,
  error: null,

  loadEntries: () => {
    set({isLoading: true});
    try {
      const entries = loadEntries();
      set({entries, isLoading: false});
    } catch (error) {
      set({error: 'Failed to load journal entries', isLoading: false});
    }
  },

  createEntry: (title, content, mood, tags = []) => {
    const now = new Date().toISOString();
    const entry: JournalEntry = {
      id: generateId(),
      title,
      content,
      mood,
      tags,
      createdAt: now,
      updatedAt: now,
      isPinned: false,
      wordCount: content.split(/\s+/).filter(Boolean).length,
    };
    set(state => {
      const entries = [entry, ...state.entries];
      saveEntries(entries);
      return {entries};
    });
    return entry;
  },

  updateEntry: (id, updates) => {
    set(state => {
      const entries = state.entries.map(e => {
        if (e.id !== id) return e;
        const updated = {
          ...e,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        if (updates.content !== undefined) {
          updated.wordCount = updates.content.split(/\s+/).filter(Boolean).length;
        }
        return updated;
      });
      saveEntries(entries);
      return {entries};
    });
  },

  deleteEntry: id => {
    set(state => {
      const entries = state.entries.filter(e => e.id !== id);
      saveEntries(entries);
      return {entries};
    });
  },

  togglePin: id => {
    set(state => {
      const entries = state.entries.map(e =>
        e.id === id ? {...e, isPinned: !e.isPinned} : e,
      );
      saveEntries(entries);
      return {entries};
    });
  },

  setViewMode: viewMode => set({viewMode}),
  setSortBy: sortBy => set({sortBy}),
  setSearchQuery: searchQuery => set({searchQuery}),
  setSelectedTags: selectedTags => set({selectedTags}),

  getFilteredEntries: () => {
    const {entries, searchQuery, selectedTags, sortBy} = get();
    let filtered = [...entries];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        e => e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q),
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(e => selectedTags.some(t => e.tags.includes(t)));
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    const pinned = filtered.filter(e => e.isPinned);
    const unpinned = filtered.filter(e => !e.isPinned);
    return [...pinned, ...unpinned];
  },

  getAllTags: () => {
    const {entries} = get();
    const tagSet = new Set<string>();
    entries.forEach(e => e.tags.forEach(t => tagSet.add(t)));
    return Array.from(tagSet).sort();
  },
}));
