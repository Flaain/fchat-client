import { useProfile } from '@/entities/profile';
import { APP_VERSION } from '@/shared/constants';
import { cn } from '@/shared/lib/utils/cn';
import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Image } from '@/shared/ui/Image';
import { PreAnimatedSkeleton } from '@/shared/ui/PreAnimatedSkeleton';
import { Typography } from '@/shared/ui/Typography';
import { Verified } from 'lucide-react';

export const LayoutSheetSkeleton = () => {
    const { profile } = useProfile();

    return (
        <div className='flex flex-col py-8 h-full'>
            <div className='flex flex-col gap-2 items-start px-4'>
                <Image
                    src={profile.avatar?.url}
                    skeleton={<AvatarByName name={profile.name} size='lg' />}
                    className='size-[50px] rounded-full'
                />
                <Typography as='h2' size='lg' weight='medium' className={cn(profile.isOfficial && 'flex items-center')}>
                    {profile.name}
                    {profile.isOfficial && (
                        <Typography className='ml-2'>
                            <Verified className='w-5 h-5' />
                        </Typography>
                    )}
                </Typography>
            </div>
            <ul className='flex flex-col gap-5'>
                {[...new Array(5)].map((_, index) => (
                    <li
                        key={index}
                        className='flex first:my-4 first:py-1 first:border-y dark:first:border-primary-dark-50 first:border-primary-dark-200'
                        >
                        <PreAnimatedSkeleton className='dark:bg-primary-dark-50 w-full h-[30px] space-y-5' />
                    </li>
                ))}
            </ul>
            <Typography as='p' variant='secondary' className='flex flex-col mt-auto px-4'>
                Syncmate, {new Date().getFullYear()}
                <Typography variant='secondary'>
                    Version {APP_VERSION}
                </Typography>
            </Typography>
        </div>
    );
}