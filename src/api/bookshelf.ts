import { AxiosResponse } from 'axios';
import { client } from '.';
import { Book, Chapter, ReaderResponse } from '../model';

const listBookshelf = async () => {
    const resp: AxiosResponse<ReaderResponse<Book[]>> = await client.get('/getBookshelf');
    return resp.data.data;
};

const listChapter = async (url: string) => {
    const resp: AxiosResponse<ReaderResponse<Chapter[]>> = await client.get(`/getChapterList?url=${url}`);
    return resp.data.data;
};

const getContent = async (url: string, index: number) => {
    const resp: AxiosResponse<ReaderResponse<string>> = await client.get(`/getBookContent?url=${url}&index=${index}`);
    return resp.data.data;
};

export default {
    listBookshelf,
    listChapter,
    getContent,
};