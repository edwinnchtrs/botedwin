export type Message = {
    id: number;
    sender: 'user' | 'bot';
    text: string;
};
