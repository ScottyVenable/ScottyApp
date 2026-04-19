import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Alert} from 'react-native';
import {Plus, Code, CopySimple, Trash} from 'phosphor-react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../hooks/useTheme';
import {storage} from '../../services/storage';
import {generateId} from '../../utils/id';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';

export interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
  createdAt: string;
}

const SNIPPETS_KEY = 'code_snippets';

function getSnippets(): Snippet[] {
  const raw = storage.getString(SNIPPETS_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as Snippet[]; } catch { return []; }
}

function saveSnippets(snippets: Snippet[]) {
  storage.set(SNIPPETS_KEY, JSON.stringify(snippets));
}

export default function SnippetListScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const [snippets, setSnippets] = useState<Snippet[]>(getSnippets);

  const deleteSnippet = (id: string) => {
    Alert.alert('Delete Snippet', 'Are you sure?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Delete', style: 'destructive', onPress: () => {
        const updated = snippets.filter(s => s.id !== id);
        saveSnippets(updated);
        setSnippets(updated);
      }},
    ]);
  };

  const renderSnippet = ({item}: {item: Snippet}) => (
    <Card onPress={() => navigation.navigate('SnippetDetail', {id: item.id})} style={styles.card}>
      <View style={styles.cardHeader}>
        <Code size={16} color={theme.colors.accent} />
        <Text style={[styles.snippetTitle, {color: theme.colors.text}]} numberOfLines={1}>{item.title}</Text>
        <Badge label={item.language} variant="accent" size="sm" />
      </View>
      <Text
        style={[styles.codePreview, {color: theme.colors.textSecondary, backgroundColor: theme.colors.backgroundTertiary}]}
        numberOfLines={2}>
        {item.code}
      </Text>
      <TouchableOpacity onPress={() => deleteSnippet(item.id)} style={styles.deleteBtn} hitSlop={8}>
        <Trash size={14} color={theme.colors.error} />
      </TouchableOpacity>
    </Card>
  );

  return (
    <ScreenWrapper>
      <View style={[styles.header, {borderBottomColor: theme.colors.borderSubtle}]}>
        <Text style={[styles.title, {color: theme.colors.text}]}>Snippets</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('SnippetCreate')}
          style={[styles.addBtn, {backgroundColor: theme.colors.accent}]}>
          <Plus size={20} color="#fff" weight="bold" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={snippets}
        renderItem={renderSnippet}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon={<Code size={28} color={theme.colors.textTertiary} />}
            title="No snippets saved"
            description="Save reusable code snippets here."
            actionLabel="Add Snippet"
            onAction={() => navigation.navigate('SnippetCreate')}
          />
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth},
  title: {fontSize: 24, fontWeight: '700'},
  addBtn: {width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center'},
  list: {padding: 16, gap: 10},
  card: {padding: 14, gap: 8},
  cardHeader: {flexDirection: 'row', alignItems: 'center', gap: 8},
  snippetTitle: {flex: 1, fontSize: 14, fontWeight: '600'},
  codePreview: {fontFamily: 'monospace', fontSize: 12, lineHeight: 18, padding: 8, borderRadius: 6},
  deleteBtn: {alignSelf: 'flex-end'},
});
