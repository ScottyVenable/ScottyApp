import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking} from 'react-native';
import {ArrowLeft, Link, Trash, BookmarkSimple, BookmarkSimpleFill} from 'phosphor-react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {useTheme} from '../../hooks/useTheme';
import {storage} from '../../services/storage';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import {ToolsStackParamList} from '../../navigation/types';
import {ReadingItem} from './ReadingListScreen';

const KEY = 'reading_list';

function getItems(): ReadingItem[] {
  const raw = storage.getString(KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as ReadingItem[]; } catch { return []; }
}

function saveItems(items: ReadingItem[]) {
  storage.set(KEY, JSON.stringify(items));
}

type ReadingItemRouteProp = RouteProp<ToolsStackParamList, 'ReadingItem'>;

export default function ReadingItemScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<ReadingItemRouteProp>();
  const {id} = route.params;

  const [item, setItem] = useState<ReadingItem | null>(null);

  useEffect(() => {
    const items = getItems();
    setItem(items.find(i => i.id === id) ?? null);
  }, [id]);

  const toggleRead = () => {
    if (!item) return;
    const updated = getItems().map(i => i.id === id ? {...i, isRead: !i.isRead} : i);
    saveItems(updated);
    setItem(prev => prev ? {...prev, isRead: !prev.isRead} : prev);
  };

  const handleDelete = () => {
    Alert.alert('Remove', 'Remove from reading list?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          const updated = getItems().filter(i => i.id !== id);
          saveItems(updated);
          navigation.goBack();
        },
      },
    ]);
  };

  const openUrl = async () => {
    if (!item?.url) return;
    const canOpen = await Linking.canOpenURL(item.url);
    if (canOpen) Linking.openURL(item.url);
  };

  const s = StyleSheet.create({
    header: {flexDirection: 'row', alignItems: 'center', padding: theme.spacing[4], gap: theme.spacing[3]},
    headerTitle: {flex: 1, fontSize: theme.fontSizes.lg, fontWeight: '600', color: theme.colors.text},
    deleteBtn: {padding: theme.spacing[2], borderRadius: theme.borderRadius.md, backgroundColor: theme.colors.backgroundSecondary},
    body: {padding: theme.spacing[4], gap: theme.spacing[4]},
    statusRow: {flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3]},
    date: {fontSize: theme.fontSizes.sm, color: theme.colors.textSecondary},
    urlRow: {flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2], padding: theme.spacing[3], backgroundColor: theme.colors.backgroundSecondary, borderRadius: theme.borderRadius.md},
    urlText: {flex: 1, fontSize: theme.fontSizes.sm, color: theme.colors.accent, textDecorationLine: 'underline'},
    notesLabel: {fontSize: theme.fontSizes.sm, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: theme.spacing[2]},
    notes: {fontSize: theme.fontSizes.md, color: theme.colors.text, lineHeight: 22},
    emptyNotes: {fontSize: theme.fontSizes.sm, color: theme.colors.textTertiary, fontStyle: 'italic'},
  });

  if (!item) {
    return (
      <ScreenWrapper>
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={22} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Item not found</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable={false}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle} numberOfLines={2}>{item.title}</Text>
        <TouchableOpacity style={s.deleteBtn} onPress={handleDelete}>
          <Trash size={18} color={theme.colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.body}>
        <View style={s.statusRow}>
          <Badge
            label={item.isRead ? 'Read' : 'Unread'}
            variant={item.isRead ? 'success' : 'default'}
            size="sm"
          />
          <Text style={s.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>

        {item.url ? (
          <TouchableOpacity style={s.urlRow} onPress={openUrl}>
            <Link size={16} color={theme.colors.accent} />
            <Text style={s.urlText} numberOfLines={1}>{item.url}</Text>
          </TouchableOpacity>
        ) : null}

        <View>
          <Text style={s.notesLabel}>Notes</Text>
          {item.notes ? (
            <Text style={s.notes}>{item.notes}</Text>
          ) : (
            <Text style={s.emptyNotes}>No notes added.</Text>
          )}
        </View>

        <Button
          label={item.isRead ? 'Mark as Unread' : 'Mark as Read'}
          onPress={toggleRead}
          variant={item.isRead ? 'secondary' : 'primary'}
          leftIcon={item.isRead
            ? <BookmarkSimple size={18} color={theme.colors.textSecondary} />
            : <BookmarkSimpleFill size={18} color={theme.colors.textInverse} />
          }
        />
      </ScrollView>
    </ScreenWrapper>
  );
}
