import { Message } from '@/entities/Message';
import { Message as IMessage } from '@/entities/Message/model/types';
import { useSession } from '@/entities/session';
import { useChat } from '@/shared/lib/providers/chat/context';
import { cn } from '@/shared/lib/utils/cn';
import { useLayout } from '@/shared/model/store';
import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Image } from '@/shared/ui/Image';
import { useShallow } from 'zustand/shallow';
import { MessageGroupProps } from '../model/types';

export const GroupedMessages = ({ messages, isLastGroup }: MessageGroupProps) => {
    const { params, textareaRef, mode, handleSelectMessage } = useChat(useShallow((state) => ({
        textareaRef: state.refs.textareaRef,
        params: state.params, 
        mode: state.mode, 
        handleSelectMessage: state.actions.handleSelectMessage 
    })));

    const userId = useSession((state) => state.userId);
    const message = messages[0];
    const isMessageFromMe = message.sender._id === userId;
    const isSelecting = mode === 'selecting';

    const handleDoubleClick = (message: IMessage) => {
        useLayout.setState((prevState) => {
            const newState = new Map([...prevState.drafts]);

            newState.set(params.id, { state: 'reply', value: '', selectedMessage: message });

            return { drafts: newState };
        })

        textareaRef.current?.focus();
    }

    return (
        <li className='flex items-end gap-3 xl:self-start w-full first-of-type:mt-auto'>
            <Image
                src={message.sender.avatar?.url}
                skeleton={<AvatarByName name={message.sender.name} className='sticky bottom-0 max-xl:hidden z-[999]' />}
                className='object-cover min-w-[40px] max-w-[40px] h-10 sticky bottom-0 rounded-full max-xl:hidden z-[999]'
            />
            <ul className={cn('flex flex-col gap-1 w-full xl:items-start', isMessageFromMe ? 'items-end' : 'items-start')}>
                {messages.map((message, index, array) => (
                    <Message
                        key={message._id}
                        isFirst={!index}
                        isMessageFromMe={isMessageFromMe}
                        isLastGroup={isLastGroup}
                        isLast={index === array.length - 1}
                        message={message}
                        onClick={isSelecting && isMessageFromMe ? () => handleSelectMessage(message) : undefined}
                        onDoubleClick={!isSelecting ? () => handleDoubleClick(message) : undefined}
                    />
                ))}
            </ul>
        </li>
    );
};