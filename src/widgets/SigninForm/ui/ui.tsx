import { Signin } from "@/features/Signin/ui/ui";
import { Forgot } from "@/features/Forgot/ui/ui";
import { Typography } from "@/shared/ui/Typography";
import { SigninStage } from "@/features/Signin/model/types";
import { stageDescription } from "../model/constants";
import { useSigninForm } from "../model/store";

const components: Record<SigninStage, React.ReactNode> = {
    signin: <Signin />,
    forgot: <Forgot />
};

export const SigninForm = () => {
    const stage = useSigninForm((state) => state.stage);
    
    return (
        <div className='flex items-center w-full h-full max-w-[1230px] box-border gap-5'>
            <div className='flex flex-col gap-2 items-end max-md:hidden max-w-[450px] w-full'>
                <Typography
                    variant='primary'
                    as='h1'
                    size='6xl'
                    weight='bold'
                    align='right'
                    className='max-lg:text-6xl'
                >
                    {stageDescription[stage].title}
                </Typography>
                <Typography as='p' size='xl' variant='secondary' align='right' className='max-lg:text-xl'>
                    {stageDescription[stage].description}
                </Typography>
            </div>
            {components[stage]}
        </div>
    );
};