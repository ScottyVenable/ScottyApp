import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput} from 'react-native';
import {Plus, BookBookmark, Link, Trash} from 'phosphor-react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../hooks/useTheme';
import {storage} from '../../services/storage';
import {generateId} from '../../utils/id';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';

export interface ReadingItem {
  id: string;
  title: string;
  url?: string;
  notes?: string;
  isRead: boolean;
  tags: string[];
  createdAt: string;
}

const KEY = 'reading_list';
function getItems(): ReadingItem[] {
  const raw = storage.getString(KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as ReadingItem[]; } catch { return []; }
}
function saveItems(items: ReadingItem[]) { storage.set(KEY, JSON.stringify(items)); }

export default function ReadingListScreen() {
  const theme = useTheme();
  const [items, setItems] = useState<ReadingItem[]>(getItems);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const addItem = () => {
    if (!newTitle.trim()) return;
    const item: ReadingItem = {id: generateId(), title: newTitle.trim(), url: newUrl.trim() || undefined, isRead: false, tags: [], createdAt: new Date().toISOString()};
    const updated = [item, ...items];
    saveItems(updated);
    setItems(updated);
    setNewTitle(''); setNewUrl(''); setShowAdd(false);
  };

  const toggleRead = (id: string) => {
    const updated = items.map(i => i.id === id ? {...i, isRead: !i.isRead} : i);
    saveItems(updated);
    setItems(updated);
  };

  const deleteItem = (id: string) => {
    Alert.alert('Remove', 'Remove from reading list?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Remove', style: 'destructive', onPress: () => {
        const updated = items.filter(i => i.id !== id);
        saveItems(updated); setItems(updated);
      }},
    ]);
  };

  const renderItem = ({item}: {item: ReadingItem}) => (
    <Card style={[styles.card, item.isRead && {opacity: 0.55}]}>
      <View style={styles.cardRow}>
        <TouchableOpacity
          onPress={() => toggleRead(item.id)}
          style={[styles.readDot, {backgroundColor: item.isRead ? theme.colors.success : theme.colors.backgroundTertiary, borderColor: item.isRead ? theme.colors.success : theme.colors.border}]}
        />
        <View style={styles.itemInfo}>
          <Text style={[styles.itemTitle, {color: theme.colors.text}, item.isRead && styles.readThrough]} numberOfLines={2}>
            {item.title}
          </Text>
          {item.url && <Text style={[styles.itemUrl, {color: theme.colors.textTertiary}]} numberOfLines={1}>{item.url}</Text>}
        </View>
        <TouchableOpacity onPress={() => deleteItem(item.id)} hitSlop={8}>
          <Trash size={16} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.header, {borderBottomColor: theme.colors.borderSubtle}]}>
        <Text style={[styles.title, {color: theme.colors.text}]}>Reading List</Text>
        <TouchableOpacity onPress={() => setShowAdd(v => !v)} style={[styles.addBtn, {backgroundColor: theme.colors.accent}]}>
          <Plus size={20} color="#fff" weight="bold" />
        </TouchableOpacity>
      </View>

      {showAdd && (
        <View style={[styles.addForm, {backgroundColor: theme.colors.backgroundSecondary, borderBottomColor: theme.colors.border}]}>
          <TextInput style={[styles.addInput, {color: theme.colors.text, borderColor: theme.colors.border}]} placeholder="Title *" placeholderTextColor={theme.colors.textTertiary} value={newTitle} onChangeText={setNewTitle} />
          <TextInput style={[styles.addInput, {color: theme.colors.text, borderColor: theme.colors.border}]} placeholder="URL (optional)" placeholderTextColor={theme.colors.textTertiary} value={newUrl} onChangeText={setNewUrl} autoCapitalize="none" keyboardType="url" />
          <TouchableOpacity onPress={addItem} style={[styles.addConfirmBtn, {backgroundColor: theme.colors.accent}]}>
            <Text style={styles.addConfirmLabel}>Add</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon={<BookBookmark size={28} color={theme.colors.textTertiary} />}
            title="Reading list empty"
            description="Save articles, books, and links to read later."
            actionLabel="Add Item"
            onAction={() => setShowAdd(true)}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth},
  title: {fontSize: 24, fontWeight: '700'},
  addBtn: {width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center'},
  addForm: {padding: 16, gap: 10, borderBottomWidth: StyleSheet.hairlineWidth},
  addInput: {paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, borderWidth: 1, fontSize: 14},
  addConfirmBtn: {paddingVertical: 10, borderRadius: 8, alignItems: 'center'},
  addConfirmLabel: {color: '#fff', fontWeight: '600', fontSize: 14},
  list: {padding: 16, gap: 8},
  card: {padding: 14},
  cardRow: {flexDirection: 'row', alignItems: 'flex-start', gap: 12},
  readDot: {width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, marginTop: 2, flexShrink: 0},
  itemInfo: {flex: 1, gap: 2},
  itemTitle: {fontSize: 14, fontWeight: '500', lineHeight: 20},
  readThrough: {textDecorationLine: 'line-through'},
  itemUrl: {fontSize: 12},
});
