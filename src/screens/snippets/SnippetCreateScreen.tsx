import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity} from 'react-native';
import {ArrowLeft} from 'phosphor-react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../hooks/useTheme';
import {storage} from '../../services/storage';
import {generateId} from '../../utils/id';
import {Snippet} from './SnippetListScreen';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const LANGUAGES = ['TypeScript', 'JavaScript', 'Python', 'Bash', 'SQL', 'CSS', 'HTML', 'JSON', 'Other'];

export default function SnippetCreateScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('TypeScript');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!title.trim() || !code.trim()) { setError('Title and code are required'); return; }
    const raw = storage.getString('code_snippets');
    const existing: Snippet[] = raw ? JSON.parse(raw) : [];
    const snippet: Snippet = {id: generateId(), title: title.trim(), code: code.trim(), language, tags: [], createdAt: new Date().toISOString()};
    storage.set('code_snippets', JSON.stringify([snippet, ...existing]));
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.header, {borderBottomColor: theme.colors.border}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <ArrowLeft size={22} color={theme.colors.text} weight="bold" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: theme.colors.text}]}>New Snippet</Text>
        <View style={{width: 22}} />
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Input label="Title" placeholder="Snippet name" value={title} onChangeText={setTitle} autoFocus />

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, {color: theme.colors.textSecondary}]}>Language</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.langRow}>
            {LANGUAGES.map(l => (
              <TouchableOpacity
                key={l}
                onPress={() => setLanguage(l)}
                style={[styles.langChip, {backgroundColor: language === l ? theme.colors.accentMuted : theme.colors.backgroundSecondary, borderColor: language === l ? theme.colors.accent : theme.colors.border}]}>
                <Text style={[styles.langLabel, {color: language === l ? theme.colors.accent : theme.colors.textSecondary}]}>{l}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, {color: theme.colors.textSecondary}]}>Code</Text>
          <View style={[styles.codeWrapper, {borderColor: theme.colors.border, backgroundColor: theme.colors.backgroundSecondary}]}>
            <TextInput
              style={[styles.codeInput, {color: theme.colors.text}]}
              placeholder="// Paste your code here..."
              placeholderTextColor={theme.colors.textTertiary}
              value={code}
              onChangeText={setCode}
              multiline
              textAlignVertical="top"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {error ? <Text style={[styles.error, {color: theme.colors.error}]}>{error}</Text> : null}
        <Button label="Save Snippet" onPress={handleSave} fullWidth />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth},
  headerTitle: {fontSize: 16, fontWeight: '600'},
  content: {padding: 20, gap: 20},
  section: {gap: 8},
  sectionLabel: {fontSize: 13, fontWeight: '600'},
  langRow: {gap: 8, paddingBottom: 4},
  langChip: {paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1},
  langLabel: {fontSize: 13, fontWeight: '500'},
  codeWrapper: {borderRadius: 10, borderWidth: 1, padding: 12},
  codeInput: {fontFamily: 'monospace', fontSize: 13, lineHeight: 20, minHeight: 160},
  error: {fontSize: 13},
});
