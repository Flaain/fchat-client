import { DataWithCursor, Message, MessageFormState, Recipient } from '@/shared/model/types';

export enum CONVERSATION_EVENTS {
    JOIN = 'conversation.join',
    LEAVE = 'conversation.leave',
    CREATED = 'conversation.created',
    DELETED = 'conversation.deleted',
    MESSAGE_READ = 'conversation.message.read',
    MESSAGE_SEND = 'conversation.message.send',
    MESSAGE_EDIT = 'conversation.message.edit',
    MESSAGE_DELETE = 'conversation.message.delete',
    USER_PRESENCE = 'conversation.user.presence',
    USER_BLOCK = 'conversation.user.block',
    USER_UNBLOCK = 'conversation.user.unblock',
    TYPING_START = 'conversation.typing.start',
    TYPING_STOP = 'conversation.typing.stop'
}

export interface ConversationStore {
    conversation: Omit<Conversation, 'messages'>;
    isRecipientTyping: boolean;
    actions: {
        handleTypingStatus: () => (action: MessageFormState, reset?: boolean) => void;
    };
}

export interface Conversation {
    _id: string;
    recipient: Recipient;
    messages: DataWithCursor<Array<[string, Message]>>;
    isInitiatorBlocked?: boolean;
    isRecipientBlocked?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface GetDescriptionParams extends Pick<Recipient, 'presence' | 'lastSeenAt'>, Pick<Conversation, 'isInitiatorBlocked' | 'isRecipientBlocked'> {
    isRecipientTyping: boolean;
}