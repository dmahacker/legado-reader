import axios, { AxiosError, AxiosResponse } from 'axios';
import * as vscode from 'vscode';

// API Import
import login from './login';
import bookshelf from './bookshelf';
import { ReaderResponse } from '../model/base';
import { ForbiddenError } from '../error/forbidden';
import { LegadoError } from '../error/base';
import { getData, hasData } from '../storage';
import { commands } from 'vscode';
import { log } from '../log';

let getServer = () => vscode.workspace.getConfiguration().get('legadoReader.server') as string;

export const client = axios.create({
    baseURL: getServer(),
});

// 根据配置自动更新服务器地址
vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration('legadoReader.server')) {
        client.defaults.baseURL = getServer();
    }
});

// 自动设置参数
client.interceptors.request.use((config) => {
    if (hasData('accessToken')) {
        const accessToken = getData<string>('accessToken')!;
        if (["get", "delete", "head", "option"].includes(config.method ?? "")) {
            const baseURL = config.baseURL!;
            const url = new URL(baseURL + config.url);
            url.searchParams.append('accessToken', accessToken);
            config.url = url.toString().replace(baseURL, '');
        }

        if (["post", "put", "patch"].includes(config.method ?? "")) {
            config.data = config.data || {};
            config.data['accessToken'] = accessToken;
        }
    }
    return config;
});

// 错误处理
client.interceptors.response.use(
    (response: AxiosResponse<ReaderResponse>) => {
        if (response.data.isSuccess) {
            return response;
        }
        if (response.data.data === 'NEED_LOGIN') {
			commands.executeCommand('setContext', 'legadoReader.isLogin', false);
            throw new ForbiddenError(response.data.errorMsg);
        }
        log.appendLine("Request failed: " + response.data.errorMsg + "[" + response.data.data + "]");
        throw new LegadoError(response.data.errorMsg);
    },
    (error: AxiosError) => {
        commands.executeCommand('setContext', 'legadoReader.isLogin', false);
        log.appendLine("Request error: " + error.message + "[" + error.code + "]");
        throw new LegadoError('连接服务器失败，请检查填写地址是否正确');
    },
);

export default {
    ...login,
    ...bookshelf,
};