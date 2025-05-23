import ChatsPlaceholderIcon from '@/shared/lib/assets/icons/chatsplaceholder.svg?react';

import { Typography } from '@/shared/ui/Typography';

export const Home = () => {
    return (
        <div className='max-md:hidden flex flex-col flex-1 gap-5 items-center justify-center dark:bg-primary-dark-200 bg-primary-white px-2'>
            <Typography as='h1' variant='primary' size='2xl' weight='bold' align='center' className='max-w-[400px]'>
                Select a chat to start messaging or create one
            </Typography>
            <ChatsPlaceholderIcon className='text-primary-white size-32' />
        </div>
    );
};