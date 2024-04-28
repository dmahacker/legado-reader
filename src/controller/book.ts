import { window } from "vscode";
import { Book } from "../model";
import api from "../api";
import { getData, setData } from "../storage";

let statusBar = window.createStatusBarItem();
statusBar.show();

let book: Book | undefined;
let chapterIndex = -1;
let chapter = "";
let line = "";

// 允许调整
let maxShow = 50;
let split = false;
let spaceChar = [
    0x0020, 0x00A0, 0x1680, 0x180E, 0x2000, 0x2001,
    0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007,
    0x2008, 0x2009, 0x200A, 0x200B, 0x202F, 0x205F,
    0x3000, 0xFEFF,
].map((c) => String.fromCharCode(c));
let splitChar = ['\n', '\t'];
let ignoreChar = splitChar.concat(spaceChar);

// 进度
interface Progress {
    index: number;
    pos: number;
}

// 按长度分割字符串
function splitByLength(str: string, length: number): string[] {
    let result = [];
    for (let i = 0; i < str.length; i += length) {
        result.push(str.substring(i, i + length));
    }
    return result;
}

export const setBook = async (_book: Book) => {
    book = _book;
    await frontRender();
    await show();
};

export const loadChapter = async (index: number) => {
    if (!book) {
        return;
    }
    chapter = await api.getContent(book.bookUrl, book.durChapterIndex);
    book.durChapterTitle = (await api.listChapter(book.bookUrl))[book.durChapterIndex].title;

    const progress = getData<Progress>(`progress:${book.bookUrl}`);
    if (progress && progress.index === index) {
        book.durChapterPos = progress.pos;
    }
    chapterIndex = index;
};

export const frontRender = async () => {
    if (!book) {
        return 0;
    }
    if (chapterIndex !== book.durChapterIndex) {
        await loadChapter(book.durChapterIndex);
    }
    let showed = "";
    let index = book.durChapterPos;
    while(showed.length < maxShow && index < chapter.length) {
        let char = chapter[index];
        index++;
        if (splitChar.includes(char)) {
            if (split) {
                break;
            }
            continue;
        }
        if (ignoreChar.includes(char)) {
            continue;
        }
        showed += char;
    }
    line = showed;
    return index;
};

export const backRender = async () => {
    if (!book) {
        return 0;
    }
    if (chapterIndex !== book.durChapterIndex) {
        await loadChapter(book.durChapterIndex);
    }
    let showed = "";
    let index = book.durChapterPos-1;
    if (index >= 0 && splitChar.includes(chapter[index]) && split) {
        index--;
    }
    while(showed.length < maxShow && index >= 0) {
        let char = chapter[index];
        index--;
        if (splitChar.includes(char)) {
            if (split) {
                break;
            }
            continue;
        }
        if (ignoreChar.includes(char)) {
            continue;
        }
        showed += char;
    }
    index++;
    line = showed.split('').reverse().join('');
    return index;
};

export const next = async () => {
    if (!book) {
        return;
    }
    if (book.durChapterPos >= chapter.length) {
        book.durChapterIndex++;
        book.durChapterPos = 0;
    } else {
        book.durChapterPos = await frontRender();
    }
    await frontRender();
    await show();
};

export const prev = async () => {
    if (!book) {
        return;
    }
    if (book.durChapterPos <= 0) {
        book.durChapterIndex--;
        await loadChapter(book.durChapterIndex);
        book.durChapterPos = chapter.length;
    }
    book.durChapterPos = await backRender();
    await show();
};

export const show = async () => {
    statusBar.text = `${line} (${book?.durChapterPos}/${chapter.length})`;
    if (!book) {
        return;
    }
    setData<Progress>(`progress:${book.bookUrl}`, {
        index: book.durChapterIndex,
        pos: book.durChapterPos,
    });
};

export const save = async () => {
    if (!book) {
        return;
    }
    book.durChapterTime = new Date().getTime();
    console.log(await api.saveProgress(book));
};