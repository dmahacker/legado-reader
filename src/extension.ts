// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { log } from './log';
import { LegadoError } from './error/base';
import { setStorage } from './storage';
import { ExtensionContext, commands, window } from 'vscode';
import { login, logout } from './controller/user';
import { BookshelfProvider } from './provider/Bookshelf';
import { Book } from './model';
import api from './api';
import { next, prev, setBook } from './controller/book';

const handleRejection: NodeJS.UnhandledRejectionListener = (reason, promise) => {
	if (!(reason instanceof LegadoError)) {
		return;
	}
	promise.catch((err) => {
		window.showErrorMessage(err.message);
	});
};


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
	log.appendLine('Legado Reader is now active');
	process.on('unhandledRejection', handleRejection);
	setStorage(context.globalState);

	commands.executeCommand('setContext', 'legadoReader.isLogin', true);

	// 注册Provider
	const bookshelfProvider = new BookshelfProvider();
	window.registerTreeDataProvider('legado-bookshelf', bookshelfProvider);

	// 注册命令
	context.subscriptions.push(
		commands.registerCommand('legadoReader.connect', (uri) => {
			commands.executeCommand('setContext', 'legadoReader.isLogin', true);
			bookshelfProvider.refresh();
		}),
		commands.registerCommand('legadoReader.login', () => {
			login().then(() => {
				commands.executeCommand('setContext', 'legadoReader.isLogin', true);
				bookshelfProvider.refresh();
			});
		}),
		commands.registerCommand('legadoReader.logout', () => {
			logout().then(() => {
				commands.executeCommand('setContext', 'legadoReader.isLogin', false);
			});
		}),
		commands.registerCommand('legadoReader.refresh', () => {
			bookshelfProvider.refresh();
		}),
		commands.registerCommand('legadoReader.open', (book: Book) => {
			setBook(book);
		}),
		commands.registerCommand('legadoReader.next', () => {
			next();
		}),
		commands.registerCommand('legadoReader.prev', () => {
			prev();
		}),
	);
}

// This method is called when your extension is deactivated
export function deactivate() {
	process.removeListener('unhandledRejection', handleRejection);
	log.dispose();
}
