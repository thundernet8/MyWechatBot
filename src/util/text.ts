exports.isPhoneNum = isPhoneNum;

function isPhoneNum(text: string) {
    return /^[1][3,4,5,7,8][0-9]{9}$/i.test(text);
}

exports.isIncludeRedPacketUri = isIncludeRedPacketUri;

function isIncludeRedPacketUri(text: string) {
    return (
        /https:\/\/h5.ele.me\/hongbao/i.test(text) ||
        /https:\/\/activity.waimai.meituan.com/i.test(text) ||
        /http:\/\/url.cn/i.test(text)
    );
}

exports.getRedPacketUri = getRedPacketUri;

function getRedPacketUri(text: string) {
    // 饿了么
    if (/https:\/\/h5.ele.me\/hongbao/i.test(text)) {
        const first = text.search(/https:\/\/h5.ele.me\/hongbao/i);
        const last = text.search(/device_id=/i) + 10;
        return text.slice(first, last).replace(/amp;/g, "");
    }

    // 美团
    if (/https:\/\/activity.waimai.meituan.com/i.test(text)) {
        const first = text.search(/https:\/\/activity.waimai.meituan.com/i);
        const last = text.search(/urlKey=/i) + 39;
        return text.slice(first, last);
    }

    // 短网址
    if (/http:\/\/url.cn/i.test(text)) {
        const first = text.search(/http:\/\/url.cn/i);
        const last = first + 21;
        return text.slice(first, last);
    }

    return "";
}
