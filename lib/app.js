var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Wechaty } = require("wechaty");
const qrcodeTerminal = require("qrcode-terminal");
class BotApp {
    constructor(username) {
        /**
         * Message handlers
         */
        this.middlewares = [];
        if (!username) {
            throw new Error("Wechat username required");
        }
        this.username = username;
    }
    get bot() {
        return this._bot;
    }
    use(middleware) {
        this.middlewares.push(middleware);
    }
    run() {
        this._bot = Wechaty.instance({ profile: this.username });
        this._bot
            .on("scan", (url, _code) => {
            console.log(url);
            let loginUrl = url.replace("qrcode", "l");
            qrcodeTerminal.generate(loginUrl);
        })
            .on("login", user => {
            console.log(`${user} logged`);
        })
            .on("message", this._onMessage.bind(this))
            .start();
    }
    _onMessage(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            let noop = () => {
                return;
            };
            return yield this.middlewares.reverse().reduce((prev, curr) => {
                return () => curr.call(this, msg, prev);
            }, noop)();
        });
    }
}
module.exports = BotApp;
