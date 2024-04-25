import { AxiosResponse } from 'axios';
import { client } from '.';
import { Book, ReaderResponse } from '../model';

const listBookshelf = async () => {
    const resp: AxiosResponse<ReaderResponse<Book[]>> = await client.get('/getBookshelf');
    return resp.data.data;
};

export default {
    listBookshelf,
};