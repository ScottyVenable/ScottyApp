import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share} from 'react-native';
import {ArrowLeft, CopySimple, ShareNetwork, Trash, PencilSimple} from 'phosphor-react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {useTheme} from '../../hooks/useTheme';
import {storage} from '../../services/storage';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import Badge from '../../components/ui/Badge';
import {ToolsStackParamList} from '../../navigation/types';
import {Snippet} from './SnippetListScreen';

const SNIPPETS_KEY = 'code_snippets';

function getSnippets(): Snippet[] {
  const raw = storage.getString(SNIPPETS_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as Snippet[]; } catch { return []; }
}

function saveSnippets(snippets: Snippet[]) {
  storage.set(SNIPPETS_KEY, JSON.stringify(snippets));
}

type SnippetDetailRouteProp = RouteProp<ToolsStackParamList, 'SnippetDetail'>;

export default function SnippetDetailScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<SnippetDetailRouteProp>();
  const {id} = route.params;

  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const snippets = getSnippets();
    const found = snippets.find(s => s.id === id) ?? null;
    setSnippet(found);
  }, [id]);

  const handleCopy = async () => {
    if (!snippet) return;
    try {
      await Share.share({message: snippet.code});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleShare = async () => {
    if (!snippet) return;
    await Share.share({title: snippet.title, message: `${snippet.title}\n\n${snippet.code}`});
  };

  const handleDelete = () => {
    Alert.alert('Delete Snippet', 'This cannot be undone.', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const snippets = getSnippets().filter(s => s.id !== id);
          saveSnippets(snippets);
          navigation.goBack();
        },
      },
    ]);
  };

  const s = StyleSheet.create({
    header: {flexDirection: 'row', alignItems: 'center', padding: theme.spacing[4], gap: theme.spacing[3]},
    title: {flex: 1, fontSize: theme.fontSizes.lg, fontWeight: '600', color: theme.colors.text},
    actions: {flexDirection: 'row', gap: theme.spacing[2]},
    iconBtn: {padding: theme.spacing[2], borderRadius: theme.borderRadius.md, backgroundColor: theme.colors.backgroundSecondary},
    meta: {paddingHorizontal: theme.spacing[4], paddingBottom: theme.spacing[3], flexDirection: 'row', gap: theme.spacing[2], alignItems: 'center'},
    langLabel: {fontSize: theme.fontSizes.sm, color: theme.colors.textSecondary},
    codeBlock: {
      margin: theme.spacing[4],
      padding: theme.spacing[4],
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.backgroundTertiary,
    },
    code: {
      fontFamily: theme.fonts.mono,
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text,
      lineHeight: 20,
    },
    copyHint: {
      marginHorizontal: theme.spacing[4],
      marginTop: -theme.spacing[2],
      fontSize: theme.fontSizes.xs,
      color: theme.colors.accent,
    },
  });

  if (!snippet) {
    return (
      <ScreenWrapper>
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={22} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={s.title}>Snippet not found</Text>
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
        <Text style={s.title} numberOfLines={1}>{snippet.title}</Text>
        <View style={s.actions}>
          <TouchableOpacity style={s.iconBtn} onPress={handleCopy}>
            <CopySimple size={18} color={copied ? theme.colors.success : theme.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={s.iconBtn} onPress={handleShare}>
            <ShareNetwork size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={s.iconBtn} onPress={handleDelete}>
            <Trash size={18} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={s.meta}>
        <Badge label={snippet.language} variant="accent" size="sm" />
        <Text style={s.langLabel}>{new Date(snippet.createdAt).toLocaleDateString()}</Text>
      </View>

      <ScrollView>
        <View style={s.codeBlock}>
          <Text style={s.code} selectable>{snippet.code}</Text>
        </View>
        {copied && <Text style={s.copyHint}>Code shared!</Text>}
      </ScrollView>
    </ScreenWrapper>
  );
}
