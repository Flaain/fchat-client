import React from "react";
import { FieldPath, useForm } from "react-hook-form";
import { CreateGroupType, ICreateGroupContext } from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createGroupSchema } from "./schemas";
import { debounce } from "@/shared/lib/utils/debounce";
import { MAX_GROUP_SIZE, steps } from "./constants";
import { useModal } from "@/shared/lib/providers/modal";
import { MIN_USER_SEARCH_LENGTH } from "@/shared/constants";
import { CreateGroupContext } from "./context";
import { useShallow } from "zustand/shallow";
import { SearchUser } from "@/widgets/Feed/types";
import { profileApi } from "@/entities/profile";
import { createGroupApi } from "../api";
import { ApiException } from "@/shared/api/error";
import { useNavigate } from "react-router-dom";

export const CreateGroupProvider = ({ children }: { children: React.ReactNode }) => {
    const { isModalDisabled, onAsyncActionModal } = useModal(useShallow((state) => ({
        isModalDisabled: state.isModalDisabled,
        onAsyncActionModal: state.actions.onAsyncActionModal
    })));

    const [step, setStep] = React.useState(0);
    const [selectedUsers, setSelectedUsers] = React.useState<Map<string, SearchUser>>(new Map());
    const [searchedUsers, setSearchedUsers] = React.useState<Array<SearchUser>>([]);

    const navigate = useNavigate();

    const form = useForm<CreateGroupType>({
        resolver: zodResolver(createGroupSchema),
        defaultValues: {
            name: '',
            username: '',
            login: ''
        },
        mode: 'onChange',
        shouldFocusError: true,
    })

    React.useEffect(() => {
        setTimeout(form.setFocus, 0, steps[step]?.fields[0]);
    }, [step]);

    const isNextButtonDisabled = 
        step !== 1 && !form.getValues(steps[step]?.fields).every?.(Boolean) || 
        !!Object.entries(form.formState.errors).some(([key]) => steps[step]?.fields.includes(key as FieldPath<CreateGroupType>)) || 
        isModalDisabled;

    const handleBack = () => setStep(prevState => prevState - 1);
    
    const handleRemove = (id: string) => setSelectedUsers((prevState) => {
        const newState = new Map([...prevState]);

        newState.delete(id);

        return newState;
    })

    const handleSearchDelay = React.useCallback(debounce(async (value: string) => {
        onAsyncActionModal(() => profileApi.search({ query: value }), {
            onReject: () => setSearchedUsers([]),
            onResolve: ({ data: { items } }) => setSearchedUsers(items),
            closeOnError: false,
            closeOnSuccess: false
        });
    }, 500), []);

    const handleSearchUser = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        const trimmedValue = value.trim();

        if (!value || !trimmedValue.length) return setSearchedUsers([]);

        if (trimmedValue.length > MIN_USER_SEARCH_LENGTH) {
            useModal.setState({ isModalDisabled: true });
            handleSearchDelay(trimmedValue);
        }
    }

    const handleSelect = (user: SearchUser) => setSelectedUsers((prevState) => {
        const newState = new Map([...prevState]);
        const isNew = !newState.has(user._id);

        if (prevState.size + 1 === MAX_GROUP_SIZE && isNew) return prevState; // +1 cuz of initiator

        isNew ? newState.set(user._id, user) : newState.delete(user._id);

        return newState
    })

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const isValid = await form.trigger(steps[step].fields, { shouldFocus: true });

        if (!isValid) return;

        const { username, ...rest } = form.getValues();

        if (step === steps.length - 1) {
            onAsyncActionModal(() => createGroupApi.create({ ...rest, participants: [...selectedUsers.keys()] }), {
                onReject: (error) => {
                    if (error instanceof ApiException) {
                        error.response.data.errors?.forEach(({ path, message }) => {
                            steps[step].fields.includes(path as FieldPath<CreateGroupType>) && form.setError(path as FieldPath<CreateGroupType>, { message }, { shouldFocus: true });  
                        })
                    }
                },
                onResolve: ({ data }) => navigate(`/group/${data._id}`)
            });
        } else {
            setStep((prevState) => prevState + 1);
        }
    }

    const value: ICreateGroupContext = {
        form,
        step,
        selectedUsers,
        searchedUsers,
        isNextButtonDisabled,
        onSubmit,
        handleSelect,
        handleRemove,
        handleSearchUser,
        handleBack
    }

    return (
        <CreateGroupContext.Provider value={value}>
            {children}
        </CreateGroupContext.Provider>
    )
}