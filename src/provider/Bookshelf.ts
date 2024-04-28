import { Command, EventEmitter, ProviderResult, TreeDataProvider, TreeItem, TreeItemCollapsibleState } from "vscode";
import { Book, Chapter } from "../model";
import api from "../api";

class ShelfTreeItem<T = any> extends TreeItem {
    type: string;
    element: T;

    constructor(element: T, config: {
        command: Command | undefined;
        type?: string;
        hasChildren?: boolean;
        getName: (element: T) => string;
    }) {
        super(config.getName(element));
        if (config.hasChildren ?? false) {
            this.collapsibleState = TreeItemCollapsibleState.Collapsed;
        }
        this.command = config.command;
        this.type = config.type ?? "unknown";
        this.element = element;
    }
}

export class BookshelfProvider implements TreeDataProvider<ShelfTreeItem> {
    private _onDidChangeTreeData = new EventEmitter<ShelfTreeItem | undefined | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ShelfTreeItem): TreeItem {
        return element;
    }

    async getChildren(element?: ShelfTreeItem): Promise<ShelfTreeItem[]> {
        if (element === undefined) {
            const books = await api.listBookshelf();
            return books.map((book) => new ShelfTreeItem(book, {
                command: {
                    command: 'legadoReader.open',
                    title: '打开小说',
                    arguments: [book],
                },
                type: 'book',
                hasChildren: true,
                getName: (book: Book) => book.name,
            }));
        }
        if (element.type === 'book') {
            const book = (element as ShelfTreeItem<Book>).element;
            const chapters = await api.listChapter(book.bookUrl);
            return chapters.map((chapter) => new ShelfTreeItem(chapter, {
                command: {
                    command: 'legadoReader.selectChapter',
                    title: '跳转到章节',
                    arguments: [chapter],
                },
                type: 'chapter',
                getName: (chapter: Chapter) => chapter.title,
            }));
        }
        return [];
    }
}