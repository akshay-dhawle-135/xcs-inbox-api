import { ConversationStatus } from '../constants/enums';
import { Conversation } from '../database/entities/Conversation';
import { ICreateConversationBody, IGetConversationQuery } from '../dtos/message/conversation';
import { getPaginationParams } from '../utils/common';
import { buildEntity, findAndCount, findOneOrFail, save } from './base';

export const createConversation = async (data: ICreateConversationBody): Promise<Conversation> => {
  const conversationInstance = buildEntity(Conversation, data);
  return save(Conversation, conversationInstance);
};

export const findConversationById = async (conversationId: string) => {
  return findOneOrFail(Conversation, { where: { id: conversationId } });
};

export async function fetchConversations({ offset, limit }: IGetConversationQuery) {
  const { skip, take } = getPaginationParams(offset, limit);
  return findAndCount(Conversation, {
    where: { status: ConversationStatus.OPEN },
    order: { updated_at: 'DESC' },
    skip,
    take,
  });
}
