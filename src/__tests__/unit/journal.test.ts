jest.mock('react-native-mmkv');
jest.mock('react-native-haptic-feedback');

import {useJournalStore} from '../../store/journalStore';

describe('Journal Store', () => {
  beforeEach(() => {
    useJournalStore.setState({entries: [], searchQuery: '', selectedTags: [], sortBy: 'newest'});
  });

  test('creates an entry', () => {
    const {createEntry, entries} = useJournalStore.getState();
    createEntry('Test Title', 'Test content here', 'good', ['tag1']);
    expect(useJournalStore.getState().entries).toHaveLength(1);
    expect(useJournalStore.getState().entries[0].title).toBe('Test Title');
  });

  test('calculates word count on create', () => {
    const {createEntry} = useJournalStore.getState();
    createEntry('Title', 'one two three four five', undefined, []);
    const entry = useJournalStore.getState().entries[0];
    expect(entry.wordCount).toBe(5);
  });

  test('deletes an entry', () => {
    const {createEntry, deleteEntry} = useJournalStore.getState();
    createEntry('Delete Me', 'content');
    const id = useJournalStore.getState().entries[0].id;
    deleteEntry(id);
    expect(useJournalStore.getState().entries).toHaveLength(0);
  });

  test('toggles pin', () => {
    const {createEntry, togglePin} = useJournalStore.getState();
    createEntry('Pin Test', 'content');
    const id = useJournalStore.getState().entries[0].id;
    expect(useJournalStore.getState().entries[0].isPinned).toBe(false);
    togglePin(id);
    expect(useJournalStore.getState().entries[0].isPinned).toBe(true);
  });

  test('filters by search query', () => {
    const store = useJournalStore.getState();
    store.createEntry('React Native Guide', 'Content about RN');
    store.createEntry('TypeScript Tips', 'Content about TS');
    store.setSearchQuery('react');
    const filtered = useJournalStore.getState().getFilteredEntries();
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('React Native Guide');
  });
});
