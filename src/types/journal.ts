export type JournalMood = 'great' | 'good' | 'okay' | 'low' | 'rough';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: JournalMood;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  wordCount: number;
}

export type JournalViewMode = 'list' | 'grid';
export type JournalSortBy = 'newest' | 'oldest' | 'updated' | 'title';
