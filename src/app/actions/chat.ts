
'use server';

import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { getDbConnection } from '@/lib/db';
import type { ChatMessage } from '@/lib/types';

const SendMessageInputSchema = z.object({
  userId: z.string().uuid(),
  content: z.string().min(1, "Message cannot be empty.").max(500, "Message too long."),
});
export type SendMessageInput = z.infer<typeof SendMessageInputSchema>;

export async function sendMessage(input: SendMessageInput): Promise<{ success: boolean; message?: string; chatMessage?: ChatMessage }> {
  const validation = SendMessageInputSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, message: validation.error.errors.map(e => e.message).join(', ') };
  }

  const { userId, content } = validation.data;

  try {
    const db = await getDbConnection();
    const user = await db.get('SELECT username FROM users WHERE id = ?', userId);

    if (!user) {
      return { success: false, message: 'User not found.' };
    }

    const messageId = uuidv4();
    const timestamp = new Date();

    await db.run(
      'INSERT INTO chat_messages (id, user_id, content, timestamp) VALUES (?, ?, ?, ?)',
      messageId,
      userId,
      content,
      timestamp.toISOString()
    );

    const newChatMessage: ChatMessage = {
      id: messageId,
      userId,
      username: user.username,
      content,
      timestamp,
    };

    return { success: true, chatMessage: newChatMessage };
  } catch (error) {
    console.error('[Chat Action] Error sending message:', error);
    return { success: false, message: 'Failed to send message. Please try again.' };
  }
}

export async function getRecentMessages(limit = 50): Promise<ChatMessage[]> {
  try {
    const db = await getDbConnection();
    const rows = await db.all<({ id: string, user_id: string, username: string, content: string, timestamp: string })[]>(`
      SELECT cm.id, cm.user_id, u.username, cm.content, cm.timestamp
      FROM chat_messages cm
      JOIN users u ON cm.user_id = u.id
      ORDER BY cm.timestamp ASC
      LIMIT ?
    `, limit);

    return rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      username: row.username,
      content: row.content,
      timestamp: new Date(row.timestamp),
    }));
  } catch (error) {
    console.error('[Chat Action] Error fetching messages:', error);
    return [];
  }
}
