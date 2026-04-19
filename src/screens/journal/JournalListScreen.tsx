import React, {useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {Plus, MagnifyingGlass, BookOpen} from 'phosphor-react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../hooks/useTheme';
import {useJournalStore} from '../../store/journalStore';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import {JournalEntry} from '../../types/journal';
import {format} from 'date-fns';

export default function JournalListScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const {loadEntries, getFilteredEntries, setSearchQuery, searchQuery} = useJournalStore();

  useEffect(() => {
    loadEntries();
  }, []);

  const entries = getFilteredEntries();

  const renderEntry = useCallback(({item}: {item: JournalEntry}) => (
    <Card
      onPress={() => navigation.navigate('JournalEntry', {id: item.id})}
      style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <Text style={[styles.entryTitle, {color: theme.colors.text}]} numberOfLines={1}>
          {item.title || 'Untitled'}
        </Text>
        {item.isPinned && (
          <Badge label="Pinned" variant="accent" size="sm" />
        )}
      </View>
      <Text style={[styles.entryPreview, {color: theme.colors.textSecondary}]} numberOfLines={2}>
        {item.content.replace(/[#*`_~>]/g, '').trim()}
      </Text>
      <View style={styles.entryFooter}>
        <Text style={[styles.entryDate, {color: theme.colors.textTertiary}]}>
          {format(new Date(item.createdAt), 'MMM d, yyyy')}
        </Text>
        <Text style={[styles.wordCount, {color: theme.colors.textTertiary}]}>
          {item.wordCount} words
        </Text>
      </View>
      {item.tags.length > 0 && (
        <View style={styles.tags}>
          {item.tags.slice(0, 3).map(tag => (
            <Badge key={tag} label={tag} variant="neutral" size="sm" />
          ))}
        </View>
      )}
    </Card>
  ), [navigation, theme]);

  return (
    <ScreenWrapper>
      <View style={[styles.header, {borderBottomColor: theme.colors.borderSubtle}]}>
        <Text style={[styles.title, {color: theme.colors.text}]}>Journal</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('JournalEditor', {})}
          style={[styles.addBtn, {backgroundColor: theme.colors.accent}]}>
          <Plus size={20} color={theme.colors.textInverse} weight="bold" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrapper}>
        <Input
          placeholder="Search entries..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<MagnifyingGlass size={16} color={theme.colors.textTertiary} />}
          containerStyle={styles.searchInput}
        />
      </View>

      <FlatList
        data={entries}
        renderItem={renderEntry}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon={<BookOpen size={28} color={theme.colors.textTertiary} />}
            title="No journal entries yet"
            description="Start writing your thoughts and ideas."
            actionLabel="New Entry"
            onAction={() => navigation.navigate('JournalEditor', {})}
          />
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {fontSize: 24, fontWeight: '700'},
  addBtn: {width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center'},
  searchWrapper: {paddingHorizontal: 16, paddingVertical: 10},
  searchInput: {},
  list: {paddingHorizontal: 16, paddingBottom: 32, gap: 10},
  entryCard: {gap: 8},
  entryHeader: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  entryTitle: {fontSize: 16, fontWeight: '600', flex: 1, marginRight: 8},
  entryPreview: {fontSize: 14, lineHeight: 20},
  entryFooter: {flexDirection: 'row', justifyContent: 'space-between'},
  entryDate: {fontSize: 12},
  wordCount: {fontSize: 12},
  tags: {flexDirection: 'row', gap: 6, flexWrap: 'wrap'},
});
