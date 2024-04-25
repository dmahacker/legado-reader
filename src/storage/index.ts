import { Memento } from "vscode";
import { LegadoError } from "../error/base";

let storage: Memento | undefined;

export const setStorage = (_storage: Memento) => {
    storage = _storage;
};

export function getData<T>(key: string) {
    if (!storage) {
        throw new LegadoError("存储未初始化");
    }

    return storage.get<T>(key);
};

export function setData<T>(key: string, value: T) {
    if (!storage) {
        throw new LegadoError("存储未初始化");
    }

    return storage.update(key, value);
};

export const hasData = (key: string) => {
    if (!storage) {
        throw new LegadoError("存储未初始化");
    }

    return storage.get(key) !== undefined;
};

export const removeData = (key: string) => {
    if (!storage) {
        throw new LegadoError("存储未初始化");
    }

    return storage.update(key, undefined);
};