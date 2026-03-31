const ConversationModel = require('../models/conversation.model');
const MessageModel = require('../models/message.model');
const ApiError = require('../utils/ApiError');

const ChatService = {
  async createConversation(appointmentId, userIds) {
    const conversation = await ConversationModel.create(appointmentId);

    for (const userId of userIds) {
      await ConversationModel.addParticipant(conversation.id, userId);
    }

    return conversation;
  },

  async listConversations(userId) {
    const conversations = await ConversationModel.listForUser(userId);

    // Enrich with participants and last message
    const enriched = await Promise.all(
      conversations.map(async (conv) => {
        const participants = await ConversationModel.getParticipants(conv.id);
        const { data: messages } = await MessageModel.listByConversation(conv.id, { page: 1, limit: 1 });
        return {
          ...conv,
          participants,
          lastMessage: messages[0] || null,
        };
      })
    );

    return enriched;
  },

  async getMessages(conversationId, userId, pagination) {
    const isParticipant = await ConversationModel.isParticipant(conversationId, userId);
    if (!isParticipant) {
      throw ApiError.forbidden('You are not a participant in this conversation');
    }

    // Mark messages as read
    await MessageModel.markAsRead(conversationId, userId);

    return MessageModel.listByConversation(conversationId, pagination);
  },

  async sendMessage(conversationId, userId, content, type = 'text') {
    const isParticipant = await ConversationModel.isParticipant(conversationId, userId);
    if (!isParticipant) {
      throw ApiError.forbidden('You are not a participant in this conversation');
    }

    return MessageModel.create({
      conversation_id: conversationId,
      sender_id: userId,
      content,
      message_type: type,
    });
  },
};

module.exports = ChatService;
