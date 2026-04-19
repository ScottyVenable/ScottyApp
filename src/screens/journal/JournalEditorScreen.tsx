import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import {
  ArrowLeft,
  FloppyDisk,
  Eye,
  PencilSimple,
  TextBolder,
  TextItalic,
  ListBullets,
  Hash,
  Quotes,
  Code,
} from 'phosphor-react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {useTheme} from '../../hooks/useTheme';
import {useJournalStore} from '../../store/journalStore';
import {JournalStackParamList} from '../../navigation/types';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

type Mode = 'edit' | 'preview' | 'split';

export default function JournalEditorScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<JournalStackParamList, 'JournalEditor'>>();
  const {entries, createEntry, updateEntry} = useJournalStore();
  const insets = useSafeAreaInsets();

  const entryId = route.params?.id;
  const existingEntry = entryId ? entries.find(e => e.id === entryId) : null;

  const [title, setTitle] = useState(existingEntry?.title ?? '');
  const [content, setContent] = useState(existingEntry?.content ?? '');
  const [mode, setMode] = useState<Mode>('edit');
  const [saved, setSaved] = useState(false);
  const editorRef = useRef<TextInput>(null);
  const selectionRef = useRef({start: 0, end: 0});

  useEffect(() => {
    if (existingEntry) {
      setTitle(existingEntry.title);
      setContent(existingEntry.content);
    }
  }, [entryId]);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      navigation.goBack();
      return;
    }
    if (existingEntry) {
      updateEntry(existingEntry.id, {title: title.trim() || 'Untitled', content});
    } else {
      createEntry(title.trim() || 'Untitled', content);
    }
    setSaved(true);
    setTimeout(() => navigation.goBack(), 300);
  };

  const insertMarkdown = (prefix: string, suffix = '', multiline = false) => {
    const {start, end} = selectionRef.current;
    const selected = content.slice(start, end);
    const before = content.slice(0, start);
    const after = content.slice(end);

    if (multiline) {
      const newContent = `${before}${prefix}${selected || 'text'}${after}`;
      setContent(newContent);
    } else {
      const newContent = `${before}${prefix}${selected || 'text'}${suffix}${after}`;
      setContent(newContent);
    }
    editorRef.current?.focus();
  };

  const mdStyles = {
    body: {color: theme.colors.text, fontSize: 15, lineHeight: 24},
    heading1: {color: theme.colors.text, fontWeight: '700' as const, fontSize: 22, marginVertical: 8},
    heading2: {color: theme.colors.text, fontWeight: '700' as const, fontSize: 18, marginVertical: 6},
    heading3: {color: theme.colors.text, fontWeight: '600' as const, fontSize: 16, marginVertical: 4},
    code_inline: {backgroundColor: theme.colors.backgroundTertiary, color: theme.colors.accent, paddingHorizontal: 4, borderRadius: 4},
    blockquote: {backgroundColor: theme.colors.backgroundSecondary, borderLeftColor: theme.colors.accent, borderLeftWidth: 3, paddingLeft: 12},
    bullet_list_icon: {color: theme.colors.accent},
    link: {color: theme.colors.accent},
  };

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: theme.colors.background}]}>
      {/* Top Bar */}
      <View style={[styles.topBar, {borderBottomColor: theme.colors.border}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn} hitSlop={8}>
          <ArrowLeft size={22} color={theme.colors.text} weight="bold" />
        </TouchableOpacity>

        <View style={styles.modeToggle}>
          {(['edit', 'split', 'preview'] as Mode[]).map(m => (
            <TouchableOpacity
              key={m}
              onPress={() => setMode(m)}
              style={[styles.modeBtn, mode === m && {backgroundColor: theme.colors.accentMuted}]}>
              {m === 'edit' ? (
                <PencilSimple size={16} color={mode === m ? theme.colors.accent : theme.colors.textTertiary} weight="bold" />
              ) : m === 'preview' ? (
                <Eye size={16} color={mode === m ? theme.colors.accent : theme.colors.textTertiary} weight="bold" />
              ) : (
                <Text style={{color: mode === m ? theme.colors.accent : theme.colors.textTertiary, fontSize: 12, fontWeight: '700'}}>
                  MD
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleSave}
          style={[styles.saveBtn, {backgroundColor: saved ? theme.colors.success : theme.colors.accent}]}>
          <FloppyDisk size={18} color={theme.colors.textInverse} weight="bold" />
          <Text style={[styles.saveBtnLabel, {color: theme.colors.textInverse}]}>
            {saved ? 'Saved' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <TextInput
        style={[styles.titleInput, {color: theme.colors.text, borderBottomColor: theme.colors.borderSubtle}]}
        placeholder="Title..."
        placeholderTextColor={theme.colors.textTertiary}
        value={title}
        onChangeText={setTitle}
        returnKeyType="next"
      />

      {/* Editor Area */}
      <KeyboardAvoidingView
        style={styles.editorArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}>
        <View style={mode === 'split' ? styles.splitView : styles.fullView}>
          {(mode === 'edit' || mode === 'split') && (
            <TextInput
              ref={editorRef}
              style={[
                styles.editor,
                {
                  color: theme.colors.text,
                  backgroundColor: theme.colors.background,
                  borderRightColor: mode === 'split' ? theme.colors.border : 'transparent',
                  borderRightWidth: mode === 'split' ? StyleSheet.hairlineWidth : 0,
                  fontFamily: 'monospace',
                  fontSize: 14,
                  lineHeight: 22,
                },
              ]}
              multiline
              value={content}
              onChangeText={setContent}
              onSelectionChange={e => {
                selectionRef.current = e.nativeEvent.selection;
              }}
              placeholder="Start writing... (Markdown supported)"
              placeholderTextColor={theme.colors.textTertiary}
              textAlignVertical="top"
              scrollEnabled={mode !== 'split'}
            />
          )}
          {(mode === 'preview' || mode === 'split') && (
            <ScrollView
              style={styles.preview}
              contentContainerStyle={styles.previewContent}
              showsVerticalScrollIndicator={false}>
              <Markdown style={mdStyles as any}>{content || '*Nothing to preview*'}</Markdown>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Toolbar */}
      {(mode === 'edit' || mode === 'split') && (
        <View style={[styles.toolbar, {backgroundColor: theme.colors.backgroundSecondary, borderTopColor: theme.colors.border, paddingBottom: insets.bottom || 8}]}>
          {[
            {icon: <TextBolder size={18} color={theme.colors.textSecondary} />, action: () => insertMarkdown('**', '**')},
            {icon: <TextItalic size={18} color={theme.colors.textSecondary} />, action: () => insertMarkdown('*', '*')},
            {icon: <Hash size={18} color={theme.colors.textSecondary} />, action: () => insertMarkdown('## ', '', true)},
            {icon: <ListBullets size={18} color={theme.colors.textSecondary} />, action: () => insertMarkdown('- ', '', true)},
            {icon: <Quotes size={18} color={theme.colors.textSecondary} />, action: () => insertMarkdown('> ', '', true)},
            {icon: <Code size={18} color={theme.colors.textSecondary} />, action: () => insertMarkdown('`', '`')},
          ].map((item, idx) => (
            <TouchableOpacity key={idx} onPress={item.action} style={styles.toolbarBtn}>
              {item.icon}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconBtn: {padding: 4},
  modeToggle: {flexDirection: 'row', gap: 2, backgroundColor: 'transparent'},
  modeBtn: {padding: 8, borderRadius: 6},
  saveBtn: {flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8},
  saveBtnLabel: {fontSize: 13, fontWeight: '600'},
  titleInput: {
    fontSize: 22,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  editorArea: {flex: 1},
  fullView: {flex: 1},
  splitView: {flex: 1, flexDirection: 'row'},
  editor: {flex: 1, padding: 16, textAlignVertical: 'top'},
  preview: {flex: 1},
  previewContent: {padding: 16},
  toolbar: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  toolbarBtn: {padding: 10, borderRadius: 6},
});
