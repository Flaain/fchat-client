import { Button } from '@/shared/ui/button';
import { Loader2 } from 'lucide-react';
import { ConversationStatuses } from '../model/types';
import { ConversationSkeleton } from './Skeleton';
import { OutletError } from '@/shared/ui/OutletError';
import { Content } from './Content';
import { useConversation } from '../model/context';
import { useParams } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';

export const Conversation = () => {
    const { id } = useParams();
    const { status, error, getConversation } = useConversation(useShallow((state) => ({
        status: state.status,
        error: state.error,
        getConversation: state.actions.getConversation
    })));

    const components: Record<Exclude<ConversationStatuses, 'refetching'>, React.ReactNode> = {
        error: (
            <OutletError
                title='Something went wrong'
                description={error! ?? 'Cannot load conversation'}
                callToAction={
                    <Button onClick={() => getConversation({ action: 'refetch', recipientId: id! })} className='mt-5'>
                        {status === 'refetching' ? <Loader2 className='w-6 h-6 animate-spin' /> : 'try again'}
                    </Button>
                }
            />
        ),
        loading: <ConversationSkeleton />,
        idle: <Content />
    };

    return components[status as keyof typeof components];
};