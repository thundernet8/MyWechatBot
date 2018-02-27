const { Wechaty } = require("wechaty");
const qrcodeTerminal = require("qrcode-terminal");

class BotApp {
    private _bot;

    public get bot() {
        return this._bot;
    }

    private username: string;

    /**
     * Message handlers
     */
    private middlewares: ((msg, next) => Promise<any>)[] = [];

    constructor(username: string) {
        if (!username) {
            throw new Error("Wechat username required");
        }
        this.username = username;
    }

    public use(middleware) {
        this.middlewares.push(middleware);
    }

    public run() {
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

    private async _onMessage(msg: string) {
        let noop = () => {
            return;
        };

        return await this.middlewares.reverse().reduce((prev, curr) => {
            return () => curr.call(this, msg, prev);
        }, noop)();
    }
}

module.exports = BotApp;
