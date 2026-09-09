export interface ChatMessage {
    role: 'user' | 'bot';
    text: string;
    time: Date;
    error?: boolean;
}
