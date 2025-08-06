import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/providers/AuthProvider';
import { Comment, getCommentsForPost, addComment, deleteComment } from '@/hooks/useComments';
import { Ionicons } from '@expo/vector-icons';

interface CommentsProps {
  postId: string;
  onCommentCountChange?: (count: number) => void;
}

export default function Comments({ postId, onCommentCountChange }: CommentsProps) {
  const { session } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const fetchedComments = await getCommentsForPost(postId);
      setComments(fetchedComments);
      onCommentCountChange?.(fetchedComments.length);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !session?.user?.id) {
      return;
    }

    setSubmitting(true);
    try {
      const comment = await addComment(session.user.id, postId, newComment.trim());
      if (comment) {
        setComments(prev => [...prev, comment]);
        setNewComment('');
        onCommentCountChange?.(comments.length + 1);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteComment(commentId);
            if (success) {
              setComments(prev => prev.filter(c => c.id !== commentId));
              onCommentCountChange?.(comments.length - 1);
            } else {
              Alert.alert('Error', 'Failed to delete comment');
            }
          },
        },
      ]
    );
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <Image 
        source={{ uri: item.user?.avatar_url || 'https://ucarecdn.com/372dbec8-6008-4d2c-917a-b6c0da1b346b/-/scale_crop/300x300/' }} 
        style={styles.avatar} 
      />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <ThemedText style={styles.username}>{item.user?.username || 'User'}</ThemedText>
          <ThemedText style={styles.timestamp}>
            {new Date(item.created_at).toLocaleDateString()}
          </ThemedText>
        </View>
        <ThemedText style={styles.commentText}>{item.content}</ThemedText>
        {session?.user?.id === item.user_id && (
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteComment(item.id)}
          >
            <Ionicons name="trash-outline" size={16} color="#ff4444" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Comments ({comments.length})</ThemedText>
      
      {/* Add Comment Input */}
      {session?.user && (
        <View style={styles.addCommentContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.submitButton, (!newComment.trim() || submitting) && styles.submitButtonDisabled]}
            onPress={handleAddComment}
            disabled={!newComment.trim() || submitting}
          >
            <ThemedText style={styles.submitButtonText}>
              {submitting ? 'Posting...' : 'Post'}
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {/* Comments List */}
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id}
        style={styles.commentsList}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadComments}
        ListEmptyComponent={
          <ThemedText style={styles.emptyText}>
            {loading ? 'Loading comments...' : 'No comments yet. Be the first to comment!'}
          </ThemedText>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  addCommentContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  commentsList: {
    flex: 1,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 20,
  },
});