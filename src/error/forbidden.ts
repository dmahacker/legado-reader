import { LegadoError } from "./base";

export class ForbiddenError extends LegadoError {
    constructor(message?: string) {
        super(message); // 调用父类的构造函数
        this.name = 'ForbiddenError'; // 设置错误的名称

        // 这一步是必要的，以正确地捕获堆栈跟踪
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else { 
            this.stack = (new Error(message)).stack; 
        }
    }
}