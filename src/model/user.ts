export interface User {
    username: string;
    lastLoginAt: number;
    accessToken: string;
    enableWebdav: boolean;
    enableLocalStore: boolean;
    enableBookSource: boolean;
    enableRssSource: boolean;
    bookSourceLimit: number;
    bookLimit: number;
    createdAt: number;
}