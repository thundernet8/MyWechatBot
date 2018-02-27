const { Contact } = require("wechaty");
const axios = require("axios");
const textKit = require("../util/text");
const { RED_PACKET_API } = require("../env");

module.exports = function() {
    let urls: string[] = [];

    return async function redPacket(ctx, next) {
        // console.log("Receive msg: " + ctx.content());

        /**
         * 发送到文件助手或者发送给微信号
         */
        if (ctx.to().name() !== "File Transfer" && !ctx.to().self()) {
            return;
        }

        // 文件助手
        const filehelper = await Contact.load("filehelper");

        if (textKit.isIncludeRedPacketUri(ctx.content())) {
            const url = textKit.getRedPacketUri(ctx.content());
            urls.push(url);
            console.log("剩余红包数", urls.length);

            // 发送到机器人
            if (ctx.to().self()) {
                await ctx.from().say("填写手机号码以领取红包");
            }

            // 发送到文件助手
            if (ctx.to().name() === "File Transfer") {
                await filehelper.say("填写手机号码以领取红包");
            }
        }

        if (textKit.isPhoneNum(ctx.content())) {
            const mobile = ctx.content();

            if (!urls.length) {
                // 发送到微信
                if (ctx.to().self()) {
                    await ctx.from().say("没有红包了");
                }

                // 发送到文件助手
                if (ctx.to().name() === "File Transfer") {
                    await filehelper.say("没有红包了");
                }

                return;
            }

            // console.log(urls[urls.length - 1], mobile);

            let res;
            try {
                res = await axios.post(RED_PACKET_API, {
                    url: urls[urls.length - 1],
                    mobile
                });
                urls.pop();
            } catch (error) {
                console.error(error);
            }

            // 发送到微信
            if (ctx.to().self()) {
                await ctx.from().say(res.data.message);
            }

            // 发送到文件助手
            if (ctx.to().name() === "File Transfer") {
                await filehelper.say(res.data.message);
            }
        }

        next();
    };
};
