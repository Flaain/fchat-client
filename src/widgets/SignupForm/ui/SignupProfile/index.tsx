import { Input } from "@/shared/ui/Input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/Form";
import { useFormContext } from "react-hook-form";
import { SignupSchemaType } from "../../model/types";

export const SignupProfile = () => {
    const form = useFormContext<SignupSchemaType>();

    return (
        <>
            <FormField
                name='name'
                control={form.control}
                render={({ field }) => (
                    <FormItem className='relative'>
                        <FormLabel className='text-white'>Name</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                placeholder='Enter your name'
                                className='focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white hover:ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:hover:ring-primary-dark-50'
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                name='login'
                control={form.control}
                render={({ field }) => (
                    <FormItem className='relative'>
                        <FormLabel className='text-white'>Login</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                placeholder='Enter your login'
                                className='focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white hover:ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:hover:ring-primary-dark-50'
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                name='birthDate'
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className='text-white'>Your birth date</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type='date'
                                placeholder='Enter your birth date'
                                className='block dark:[color-scheme:dark] focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white hover:ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:hover:ring-primary-dark-50'
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
};