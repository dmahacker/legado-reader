import api from '../api';
import { window } from 'vscode';
import { removeData, setData } from '../storage';

export const login = async () => {
	const username = await window.showInputBox({
		prompt: '请输入登录用户名',
		placeHolder: '用户名'
	}) ?? "";
	const password = await window.showInputBox({
		prompt: '请输入登录密码',
		placeHolder: '密码',
		password: true
	}) ?? "";
	const user = await api.login(username, password);
	setData('accessToken', user.accessToken);
};

export const logout = async () => {
	removeData('accessToken');
};