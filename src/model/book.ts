interface ReadConfig {
    reverseToc: boolean;
    pageAnim: number;
    reSegment: boolean;
    useReplaceRule: boolean;
    delTag: number;
    pdfImageWidth: number;
}

export interface Book {
    bookUrl: string;
    tocUrl: string;
    origin: string;
    originName: string;
    name: string;
    author: string;
    type: number;
    group: number;
    latestChapterTime: number;
    lastCheckTime: number;
    lastCheckCount: number;
    totalChapterNum: number;
    durChapterIndex: number;
    durChapterPos: number;
    durChapterTime: number;
    canUpdate: boolean;
    order: number;
    originOrder: number;
    useReplaceRule: boolean;
    isInShelf: boolean;
    readConfig?: ReadConfig;
    kind?: string;
    coverUrl?: string;
    intro?: string;
    latestChapterTitle?: string;
    durChapterTitle?: string;
    wordCount?: string;
    variable?: string;
}

export interface Chapter {
    url: string;
    title: string;
    isVolume: boolean;
    baseUrl: string;
    bookUrl: string;
    index: number;
    tag?: string;
}