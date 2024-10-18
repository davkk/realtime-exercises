export type Message = {
    user: string;
    text: string;
    time: Date;
};

export type GetMessages = {
    msg: Message[];
};

export interface MessageForm extends HTMLFormControlsCollection {
    user: HTMLInputElement;
    text: HTMLInputElement;
}
