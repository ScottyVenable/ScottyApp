import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity} from 'react-native';
import {ArrowLeft, FloppyDisk} from 'phosphor-react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../hooks/useTheme';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function BlogEditorScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.header, {borderBottomColor: theme.colors.border}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <ArrowLeft size={22} color={theme.colors.text} weight="bold" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: theme.colors.text}]}>Write Post</Text>
        <TouchableOpacity style={[styles.publishBtn, {backgroundColor: theme.colors.accent}]}>
          <Text style={styles.publishLabel}>Publish</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Input label="Title" placeholder="Post title..." value={title} onChangeText={setTitle} />
        <View style={[styles.bodyWrapper, {borderColor: theme.colors.border, backgroundColor: theme.colors.backgroundSecondary}]}>
          <TextInput
            style={[styles.body, {color: theme.colors.text}]}
            placeholder="Write your post... (Markdown supported)"
            placeholderTextColor={theme.colors.textTertiary}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </View>
        <Text style={[styles.hint, {color: theme.colors.textTertiary}]}>Markdown is supported</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth},
  headerTitle: {fontSize: 16, fontWeight: '600'},
  publishBtn: {paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8},
  publishLabel: {color: '#fff', fontSize: 13, fontWeight: '600'},
  content: {padding: 20, gap: 16},
  bodyWrapper: {borderRadius: 10, borderWidth: 1, padding: 12, minHeight: 200},
  body: {fontSize: 15, lineHeight: 24},
  hint: {fontSize: 12},
});
