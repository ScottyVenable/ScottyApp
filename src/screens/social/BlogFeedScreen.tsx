import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {Plus, Rss, Heart, ChatCircle} from 'phosphor-react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../hooks/useTheme';
import {BlogPost} from '../../types/social';
import Card from '../../components/ui/Card';
import Header from '../../components/layout/Header';
import EmptyState from '../../components/ui/EmptyState';
import {format} from 'date-fns';

const DEMO_POSTS: BlogPost[] = [
  {id: '1', title: 'Getting organized with ScottyApp', content: 'Today I want to share how I have been using my new multi-tool app...', authorId: 'scotty', authorName: 'Scotty', tags: ['productivity', 'adhd'], publishedAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isPublished: true, likes: 12, commentCount: 3, readTimeMinutes: 3},
];

export default function BlogFeedScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const [posts] = useState<BlogPost[]>(DEMO_POSTS);

  const renderPost = ({item}: {item: BlogPost}) => (
    <Card onPress={() => navigation.navigate('BlogPost', {id: item.id})} style={styles.postCard}>
      <Text style={[styles.postTitle, {color: theme.colors.text}]}>{item.title}</Text>
      <Text style={[styles.postExcerpt, {color: theme.colors.textSecondary}]} numberOfLines={2}>
        {item.excerpt ?? item.content}
      </Text>
      <View style={styles.postMeta}>
        <Text style={[styles.postAuthor, {color: theme.colors.textTertiary}]}>
          {item.authorName} · {format(new Date(item.publishedAt), 'MMM d')} · {item.readTimeMinutes}m read
        </Text>
        <View style={styles.postStats}>
          <Heart size={14} color={theme.colors.textTertiary} />
          <Text style={[styles.statNum, {color: theme.colors.textTertiary}]}>{item.likes}</Text>
          <ChatCircle size={14} color={theme.colors.textTertiary} />
          <Text style={[styles.statNum, {color: theme.colors.textTertiary}]}>{item.commentCount}</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.header, {borderBottomColor: theme.colors.border}]}>
        <Header title="Blog" showBack />
        <TouchableOpacity onPress={() => navigation.navigate('BlogEditor', {})} style={[styles.addBtn, {backgroundColor: theme.colors.accent}]}>
          <Plus size={18} color="#fff" weight="bold" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState icon={<Rss size={28} color={theme.colors.textTertiary} />} title="No posts yet" description="Be the first to share something." actionLabel="Write Post" onAction={() => navigation.navigate('BlogEditor', {})} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 16},
  addBtn: {width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center'},
  list: {padding: 16, gap: 12},
  postCard: {gap: 8},
  postTitle: {fontSize: 17, fontWeight: '700'},
  postExcerpt: {fontSize: 14, lineHeight: 20},
  postMeta: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  postAuthor: {fontSize: 12},
  postStats: {flexDirection: 'row', alignItems: 'center', gap: 4},
  statNum: {fontSize: 12, marginRight: 6},
});
