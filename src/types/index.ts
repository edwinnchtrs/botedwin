import type { MediaData } from '../services/mediaDownloader';

export type Message = {
    id: number;
    sender: 'user' | 'bot';
    text: string;
    timestamp: number;
    gameId?: string;
    musicData?: {
        title: string;
        author: string;
        thumbnail: string;
        url: string;
    };
    mediaData?: MediaData; // Enhanced media with multi-quality downloads
    imageUrl?: string;
};

export interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    timestamp: number;
    isPinned?: boolean;
}
