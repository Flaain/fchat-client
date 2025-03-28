import React from 'react';
import { toast } from 'sonner';
import { useModal } from '@/shared/lib/providers/modal';
import { sessionApi } from '@/entities/session';
import { useQuery } from '@/shared/lib/hooks/useQuery';

export const useActiveSessions = () => {
    const { data, isLoading, setData: setSessions } = useQuery(() => sessionApi.getSessions());
    const [isTerminating, setIsTerminating] = React.useState(false);

    const onAsyncActionModal = useModal((state) => state.actions.onAsyncActionModal);
    
    const handleTerimanteSessions = async () => {
        setIsTerminating(true);

        await onAsyncActionModal(sessionApi.terminateAllSessions, {
            onResolve: ({ data: { deletedCount } }) => {
                setSessions((prevState) => ({ ...prevState!, sessions: [] }));
                toast.success(`${deletedCount} ${deletedCount > 1 ? 'sessions' : 'session'} was terminated`, { position: 'top-center' });
            },
            onReject: (error) => {
                console.error(error);
                toast.error('Failed to terminate sessions', { position: 'top-center' });
            }
        });

        setIsTerminating(false);
    };

    const handleDropSession = React.useCallback(async (sessionId: string) => {
        setSessions((prevState) => ({
            ...prevState!,
            sessions: prevState!.sessions.filter((session) => session._id !== sessionId)
        }));
    }, []);

    return { data, isLoading, isTerminating, handleDropSession, handleTerimanteSessions };
};