import { Message } from "@/entities/Message/model/types";

export interface MessageGroupProps {
    messages: Array<Message>;
    isLastGroup: boolean;
}