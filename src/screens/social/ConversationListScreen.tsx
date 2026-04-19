import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {ChatCircle} from 'phosphor-react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../hooks/useTheme';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import {Conversation} from '../../types/social';

const DEMO: Conversation[] = [
  {id: '1', participantIds: ['scotty', 'friend1'], participantNames: ['Scotty', 'Alex'], lastMessage: 'Hey, how is the app coming along?', lastMessageAt: new Date().toISOString(), unreadCount: 2},
];

export default function ConversationListScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();

  const renderItem = ({item}: {item: Conversation}) => {
    const other = item.participantNames.find(n => n !== 'Scotty') ?? 'Unknown';
    return (
      <Card onPress={() => navigation.navigate('Chat', {conversationId: item.id, recipientName: other})} style={styles.convCard}>
        <View style={styles.convRow}>
          <View style={[styles.avatar, {backgroundColor: theme.colors.accentMuted}]}>
            <Text style={[styles.avatarText, {color: theme.colors.accent}]}>{other[0]}</Text>
          </View>
          <View style={styles.convInfo}>
            <Text style={[styles.convName, {color: theme.colors.text}]}>{other}</Text>
            <Text style={[styles.convLast, {color: theme.colors.textTertiary}]} numberOfLines={1}>{item.lastMessage}</Text>
          </View>
          {item.unreadCount > 0 && (
            <View style={[styles.unreadBadge, {backgroundColor: theme.colors.accent}]}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: theme.colors.background}]}>
      <Header title="Messages" showBack />
      <FlatList
        data={DEMO}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState icon={<ChatCircle size={28} color={theme.colors.textTertiary} />} title="No messages" description="Start a conversation." />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  list: {padding: 16, gap: 8},
  convCard: {padding: 14},
  convRow: {flexDirection: 'row', alignItems: 'center', gap: 12},
  avatar: {width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center'},
  avatarText: {fontSize: 18, fontWeight: '700'},
  convInfo: {flex: 1},
  convName: {fontSize: 15, fontWeight: '600'},
  convLast: {fontSize: 13, marginTop: 2},
  unreadBadge: {width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center'},
  unreadText: {color: '#fff', fontSize: 11, fontWeight: '700'},
});
