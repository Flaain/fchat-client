import React from 'react';
import { Typography } from '@/shared/ui/Typography';
import { cn } from '@/shared/lib/utils/cn';
import { MessageContextMenu } from './ContextMenu';
import { Check, CheckCheck } from 'lucide-react';
import { ContextMenu, ContextMenuTrigger } from '@/shared/ui/context-menu';
import { MessageProps } from '../model/types';
import { markdownCompiler } from '@/shared/lib/utils/markdownCompiler';
import { PartOfCompilerUse } from '@/shared/model/types';
import { getBubblesStyles } from '../lib/getBubblesStyles';
import { useChat } from '@/shared/lib/providers/chat/context';
import { useShallow } from 'zustand/shallow';

export const Message = React.forwardRef<HTMLLIElement, MessageProps>(
    ({ message, isFirst, isLast, isMessageFromMe, className, ...rest }, ref) => {
        const [isContextMenuOpen, setIsContextMenuOpen] = React.useState(false);
        
        const { createdAt, refPath, updatedAt, sender, text, hasBeenRead, hasBeenEdited, replyTo } = message;
        const { selectedMessages, isContextActionsBlocked } = useChat(useShallow((state) => ({
            selectedMessages: state.selectedMessages,
            isContextActionsBlocked: state.isContextActionsBlocked
        })));

        const isSelected = selectedMessages.has(message._id);
        const createTime = new Date(createdAt);
        const editTime = new Date(updatedAt);
        const stylesForBottomIcon = cn(
            'w-4 h-4 mt-0.5',
            isMessageFromMe
                ? 'dark:text-primary-dark-200 text-primary-white'
                : 'dark:text-primary-white text-primary-dark-200'
        );

        return (
            <ContextMenu onOpenChange={setIsContextMenuOpen}>
                <ContextMenuTrigger asChild disabled={isContextActionsBlocked}>
                    <li
                        {...rest}
                        ref={ref}
                        className={cn(
                            'flex gap-2 relative w-full z-10',
                            !isMessageFromMe && isFirst && 'flex-col',
                            isSelected && 'xl:after:-left-1/2 after:-right-1/2 after:w-[200%] after:z-[-1] after:absolute after:-top-1 after:bottom-0 after:dark:bg-primary-dark-50',
                            className
                        )}
                    >
                        {isLast && (
                            <svg
                                width='11'
                                height='20'
                                viewBox='0 0 11 20'
                                fill='currentColor'
                                className={cn('absolute z-10 bottom-0 w-[11px] h-5 block', {
                                    ['-right-[11px] xl:-left-[11px] dark:text-primary-white text-primary-gray max-xl:scale-x-[-1]']: isMessageFromMe,
                                    ['dark:text-primary-dark-50 text-primary-gray -left-[11px]']: !isMessageFromMe
                                })}
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    d='M11 0C11 6.42858 7.76471 15.3571 1.29412 17.1429C1.29412 17.1429 0 17.1429 0 18.5714C0 20 1.29412 20 1.29412 20L11 20V0Z'
                                    fill='currentColor'
                                />
                            </svg>
                        )}
                        {!isMessageFromMe && isFirst && refPath === 'Participant' && (
                            <Typography variant='primary' weight='semibold'>
                                {sender.name || sender.user.name}
                            </Typography>
                        )}
                        <div
                            className={cn(
                                'py-2 px-3 xl:m-0 relative max-w-[500px]',
                                isMessageFromMe ? 'ml-auto' : 'mr-auto',
                                (replyTo === null || !!replyTo) && 'flex flex-col gap-2',
                                getBubblesStyles({
                                    isFirst,
                                    isLast,
                                    isMessageFromMe
                                })
                            )}
                        >
                            {(replyTo === null || !!replyTo) && (
                                <Typography
                                    as='p'
                                    weight='semibold'
                                    className={cn(
                                        'line-clamp-1 dark:text-primary-blue text-xs flex flex-col py-1 px-2 w-full rounded bg-primary-blue/10 border-l-4 border-solid border-primary-blue'
                                    )}
                                >
                                    {replyTo === null
                                        ? 'Deleted Message'
                                        : replyTo.refPath === 'User'
                                        ? replyTo.sender.name
                                        : replyTo.sender.name || replyTo.sender.user.name}
                                    {!!replyTo && (
                                        <Typography
                                            className={cn(
                                                'text-xs line-clamp-1',
                                                isMessageFromMe
                                                    ? 'dark:text-primary-dark-200 text-primary-white'
                                                    : 'dark:text-primary-white text-primary-dark-50'
                                            )}
                                        >
                                            {markdownCompiler(replyTo.text, PartOfCompilerUse.REPLY)}
                                        </Typography>
                                    )}
                                </Typography>
                            )}
                            <div className='flex items-center gap-2 flex-wrap'>
                                <Typography
                                    as='p'
                                    className={cn(
                                        'break-all overflow-y-hidden',
                                        isMessageFromMe ? 'dark:text-primary-dark-200' : 'text-primary-white'
                                    )}
                                >
                                    {markdownCompiler(text, PartOfCompilerUse.MESSAGE)}
                                </Typography>
                                <Typography
                                    size='sm'
                                    className={cn(
                                        'mt-0.5 ml-auto flex items-center gap-2',
                                        isMessageFromMe
                                            ? 'dark:text-primary-dark-50/20 text-primary-white'
                                            : 'dark:text-primary-white/20'
                                    )}
                                    title={`${createTime.toLocaleString()}${
                                        hasBeenEdited ? `\nEdited: ${editTime.toLocaleString()}` : ''
                                    }`}
                                >
                                    {new Date(createdAt).toLocaleTimeString(navigator.language ?? 'en-US', {
                                        timeStyle: 'short'
                                    })}
                                    {hasBeenEdited && ', edited'}
                                    {hasBeenRead ? (
                                        <CheckCheck className={stylesForBottomIcon} />
                                    ) : (
                                        <Check className={stylesForBottomIcon} />
                                    )}
                                </Typography>
                            </div>
                        </div>
                    </li>
                </ContextMenuTrigger>
                {isContextMenuOpen && !isContextActionsBlocked && (
                    <MessageContextMenu
                        message={message}
                        isMessageFromMe={isMessageFromMe}
                        onClose={() => setIsContextMenuOpen(false)}
                    />
                )}
            </ContextMenu>
        );
    }
);