import React from 'react';
import {ScrollView, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Markdown from 'react-native-markdown-display';
import {ArrowLeft, PencilSimple, Trash} from 'phosphor-react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../hooks/useTheme';
import {useJournalStore} from '../../store/journalStore';
import {JournalStackParamList} from '../../navigation/types';
import {format} from 'date-fns';
import Badge from '../../components/ui/Badge';

export default function JournalEntryScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<JournalStackParamList, 'JournalEntry'>>();
  const {entries, deleteEntry} = useJournalStore();
  const entry = entries.find(e => e.id === route.params.id);

  if (!entry) return null;

  const handleDelete = () => {
    deleteEntry(entry.id);
    navigation.goBack();
  };

  const mdStyles = {
    body: {color: theme.colors.text, fontSize: 15, lineHeight: 24},
    heading1: {color: theme.colors.text, fontWeight: '700' as const, fontSize: 22, marginVertical: 8},
    heading2: {color: theme.colors.text, fontWeight: '700' as const, fontSize: 18, marginVertical: 6},
    code_inline: {backgroundColor: theme.colors.backgroundTertiary, color: theme.colors.accent, paddingHorizontal: 4, borderRadius: 4},
    blockquote: {backgroundColor: theme.colors.backgroundSecondary, borderLeftColor: theme.colors.accent, borderLeftWidth: 3, paddingLeft: 12},
    link: {color: theme.colors.accent},
  };

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.topBar, {borderBottomColor: theme.colors.border}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <ArrowLeft size={22} color={theme.colors.text} weight="bold" />
        </TouchableOpacity>
        <View style={styles.topActions}>
          <TouchableOpacity onPress={() => navigation.navigate('JournalEditor', {id: entry.id})} hitSlop={8}>
            <PencilSimple size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} hitSlop={8} style={styles.deleteBtn}>
            <Trash size={20} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, {color: theme.colors.text}]}>{entry.title}</Text>
        <View style={styles.meta}>
          <Text style={[styles.date, {color: theme.colors.textTertiary}]}>
            {format(new Date(entry.createdAt), 'MMMM d, yyyy · h:mm a')}
          </Text>
          <Text style={[styles.wordCount, {color: theme.colors.textTertiary}]}>
            {entry.wordCount} words
          </Text>
        </View>
        {entry.tags.length > 0 && (
          <View style={styles.tags}>
            {entry.tags.map(tag => (
              <Badge key={tag} label={tag} variant="neutral" size="sm" />
            ))}
          </View>
        )}
        <View style={styles.divider} />
        <Markdown style={mdStyles as any}>{entry.content}</Markdown>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  topActions: {flexDirection: 'row', gap: 16},
  deleteBtn: {marginLeft: 4},
  content: {padding: 20, paddingBottom: 48},
  title: {fontSize: 26, fontWeight: '700', lineHeight: 34},
  meta: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 6},
  date: {fontSize: 13},
  wordCount: {fontSize: 13},
  tags: {flexDirection: 'row', gap: 6, marginTop: 10, flexWrap: 'wrap'},
  divider: {height: 1, marginVertical: 16},
});
