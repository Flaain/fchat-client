import { cn } from '@/shared/lib/utils/cn';
import { useLayout, useSocket } from '@/shared/model/store';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Feed } from '@/widgets/Feed/ui/ui';
import { AlignJustifyIcon, Loader2, X } from 'lucide-react';
import { useShallow } from 'zustand/shallow';
import { useSidebar } from '../model/context';
import { sidebarSelector } from '../model/selectors';

export const Sidebar = ({ onMenuClick }: { onMenuClick: () => void; }) => {
    const { ref, value, handleLogout, handleSearch, resetSearch } = useSidebar(useShallow(sidebarSelector));

    const connectedToNetwork = useLayout((state) => state.connectedToNetwork);
    const isSocketConnected = useSocket((state) => state.isConnected);
    
    const isDisabled = !connectedToNetwork || !isSocketConnected;

    return (
        <aside className='flex flex-col h-svh sticky top-0 gap-2 max-md:fixed dark:bg-primary-dark-150 bg-primary-white md:max-w-[420px] w-full border-r-2 border-r-primary-dark-50 border-solid'>
            <div className='flex items-center justify-between gap-5 sticky top-0 py-4 px-3 box-border h-[70px]'>
                <Button
                    variant='text'
                    size='icon'
                    onClick={onMenuClick}
                    className='opacity-30'
                >
                    <AlignJustifyIcon />
                </Button>
                <div className='flex w-full relative'>
                    {isDisabled && (
                        <div className='absolute left-3 top-1/2 -translate-y-1/2'>
                            <Loader2 className='animate-spin size-5 z-10 text-primary-white' />
                        </div>
                    )}
                    <Input
                        ref={ref}
                        onChange={handleSearch}
                        value={value}
                        placeholder={!connectedToNetwork ? 'Waiting for network' : !isSocketConnected ? 'Connecting...' : 'Search...'}
                        className={cn(
                            'flex-1 pr-9 focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white hover:ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:hover:ring-primary-dark-50',
                            isDisabled && 'pl-10'
                        )}
                    />
                </div>
                {!!value.trim().length && (
                    <Button variant='text' size='icon' onClick={resetSearch} className='p-0 absolute right-6'>
                        <X className='w-5 h-5' />
                    </Button>
                )}
            </div>
            <Feed />
            <div className='mt-auto dark:bg-primary-dark-100 sticky bottom-0 py-4 px-3 max-h-[70px] box-border'>
                <Button onClick={handleLogout} variant='secondary' className='w-full'>
                    Logout
                </Button>
            </div>
        </aside>
    );
};
