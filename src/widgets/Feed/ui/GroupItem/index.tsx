import Verified from '@/shared/lib/assets/icons/verified.svg?react';
import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Typography } from '@/shared/ui/Typography';
import { cn } from '@/shared/lib/utils/cn';
import { NavLink } from 'react-router-dom';
import { useSession } from '@/entities/session';
import { useLayout } from '@/shared/model/store';
import { GroupFeedItemProps } from '../../types';

export const GroupItem = (props: GroupFeedItemProps) => {
    const group = props.isGlobal ? props.group : props.group.item;
    const userId = useSession((state) => state.userId);
    const draft = useLayout((state) => state.drafts.get(group._id));

    return (
        <li>
            <NavLink
                state={{ name: group.name, isOfficial: group.isOfficial }}
                to={`/group/${group._id}`}
                className={({ isActive }) =>
                    cn(
                        'flex items-center gap-5 p-2 rounded-lg transition-colors duration-200 ease-in-out',
                        isActive
                            ? 'dark:bg-primary-dark-50 bg-primary-gray/10'
                            : 'dark:hover:bg-primary-dark-50/30 hover:bg-primary-gray/5'
                    )
                }
            >
                <AvatarByName size='lg' />
                <div className='flex flex-col items-start w-full'>
                    <Typography as='h2' weight='medium' className={cn(group.isOfficial && 'flex items-center')}>
                        {group.name}
                        {group.isOfficial && (
                            <Typography className='ml-2'>
                                <Verified className='w-5 h-5' />
                            </Typography>
                        )}
                    </Typography>
                    {draft?.state === 'send' ? (
                        <Typography as='p' variant='secondary' className='line-clamp-1'>
                            <Typography as='span' variant='error'>
                                Draft:&nbsp;
                            </Typography>
                            {draft.value}
                        </Typography>
                    ) : !props.isGlobal && props.group.item.lastMessage ? (
                        <div className='flex items-center w-full gap-5'>
                            <Typography as='p' variant='secondary' className='line-clamp-1'>
                                {props.group.item.lastMessage.sender._id === userId
                                    ? props.group.item.lastMessage.text
                                    : `${props.group.item.lastMessage.sender.name}: ${props.group.item.lastMessage.text}`}
                            </Typography>
                            <Typography className='ml-auto' variant='secondary'>
                                {new Date(props.group.item.lastMessage.createdAt).toLocaleTimeString(navigator.language, {
                                    hour: 'numeric',
                                    minute: 'numeric'
                                })}
                            </Typography>
                        </div>
                    ) : (
                        <Typography variant='secondary'>@{group.login}</Typography>
                    )}
                </div>
            </NavLink>
        </li>
    );
};