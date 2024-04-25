import { AxiosResponse } from "axios";
import { client } from ".";
import { ReaderResponse, User } from "../model";

const login = async (username: string, password: string) => {
    const resp: AxiosResponse<ReaderResponse<User>> = await client.post("/login", {
        code: "",
        isLogin: true,
        username,
        password
    });
    return resp.data.data;
};

export default {
    login,
};