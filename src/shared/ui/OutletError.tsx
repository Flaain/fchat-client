import { OutletContainer } from './OutletContainer';
import { Typography } from './Typography';

export const OutletError = ({
    title,
    description,
    callToAction,
    img
}: {
    img?: React.ReactNode;
    callToAction?: React.ReactNode;
    title: string;
    description?: string;
}) => {
    return (
        <OutletContainer>
            <div className='flex flex-col gap-2 m-auto items-center max-w-[500px] w-full px-5 box-border'>
                {img}
                <Typography as='h1' variant='primary' size='5xl' weight='bold' align='center' className='max-w-[400px]'>
                    {title}
                </Typography>
                {description && (
                    <Typography
                        as='p'
                        variant='secondary'
                        size='md'
                        weight='normal'
                        align='center'
                        className='max-w-[400px] mt-2'
                    >
                        {description}
                    </Typography>
                )}
                {callToAction}
            </div>
        </OutletContainer>
    );
};