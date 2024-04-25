export interface ReaderResponse<T = any> {
    isSuccess: boolean;
    errorMsg: string;
    data: T;
}
