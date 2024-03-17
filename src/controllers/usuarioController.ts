import WebSocket from "ws";
import { IMessageSocket, Message } from "..";

export class UsuarioController {

    public message: Message;
    constructor(message: Message) {
        this.message = message;
    }
    public async create(): Promise<void> {
        const { channel, data, event, type } = this.message.request

        const response: IMessageSocket<string> = {
            ...this.message.request,
            data:"añadiendo data"
        }

        return this.message.response(response);
    }
    public async store(): Promise<void> {

    }
}