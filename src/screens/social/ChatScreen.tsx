import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform} from 'react-native';
import {PaperPlaneTilt} from 'phosphor-react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../hooks/useTheme';
import {ProfileStackParamList} from '../../navigation/types';
import Header from '../../components/layout/Header';
import {Message} from '../../types/social';
import {generateId} from '../../utils/id';

export default function ChatScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<ProfileStackParamList, 'Chat'>>();
  const insets = useSafeAreaInsets();
  const {recipientName} = route.params;
  const [messages, setMessages] = useState<Message[]>([
    {id: '0', conversationId: route.params.conversationId, senderId: 'friend1', receiverId: 'scotty', content: 'Hey, how is the app coming along?', sentAt: new Date().toISOString(), isRead: true},
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg: Message = {
      id: generateId(),
      conversationId: route.params.conversationId,
      senderId: 'scotty',
      receiverId: 'friend1',
      content: input.trim(),
      sentAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages(prev => [...prev, msg]);
    setInput('');
  };

  const renderMessage = ({item}: {item: Message}) => {
    const isMine = item.senderId === 'scotty';
    return (
      <View style={[styles.msgWrapper, isMine && styles.msgWrapperRight]}>
        <View style={[styles.bubble, {backgroundColor: isMine ? theme.colors.accent : theme.colors.backgroundSecondary}]}>
          <Text style={[styles.bubbleText, {color: isMine ? '#fff' : theme.colors.text}]}>{item.content}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: theme.colors.background}]}>
      <Header title={recipientName} showBack />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={60}>
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
        <View style={[styles.inputBar, {borderTopColor: theme.colors.border, backgroundColor: theme.colors.background, paddingBottom: insets.bottom || 12}]}>
          <TextInput
            style={[styles.input, {color: theme.colors.text, backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border}]}
            placeholder="Message..."
            placeholderTextColor={theme.colors.textTertiary}
            value={input}
            onChangeText={setInput}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity onPress={sendMessage} style={[styles.sendBtn, {backgroundColor: theme.colors.accent}]}>
            <PaperPlaneTilt size={18} color="#fff" weight="fill" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  flex: {flex: 1},
  list: {padding: 16, gap: 8},
  msgWrapper: {flexDirection: 'row'},
  msgWrapperRight: {justifyContent: 'flex-end'},
  bubble: {maxWidth: '80%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16},
  bubbleText: {fontSize: 15, lineHeight: 20},
  inputBar: {flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth},
  input: {flex: 1, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: 1, fontSize: 15},
  sendBtn: {width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center'},
});
