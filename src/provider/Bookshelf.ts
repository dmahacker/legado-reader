import { EventEmitter, ProviderResult, TreeDataProvider, TreeItem } from "vscode";
import { Book } from "../model";
import api from "../api";

class BookTreeItem extends TreeItem {
    constructor(book: Book) {
        super(book.name);
    }
}

export class BookshelfProvider implements TreeDataProvider<Book> {
    private _onDidChangeTreeData = new EventEmitter<Book | undefined | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: Book): TreeItem {
        return new BookTreeItem(element);
    }

    getChildren(element?: Book): ProviderResult<Book[]> {
        return api.listBookshelf();
    }
}