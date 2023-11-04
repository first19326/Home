// import axios from "axios";
import fetchJsonp from "fetch-jsonp";

/**
 * 音乐播放器
 */

// 获取音乐播放列表
export const getPlayerList = async (api, server, type, id) => {
    const res = await fetch(
        `${api}?server=${server}&type=${type}&id=${id}`
    );
    const data = await res.json();

    if (data[0].url.startsWith("@")) {
        const [handle, jsonpCallback, jsonpCallbackFunction, url] = data[0].url.split("@").slice(1);
        const jsonpData = await fetchJsonp(url).then((res) => res.json());
        const domain = (
            jsonpData.req_0.data.sip.find((i) => !i.startsWith("http://ws")) || jsonpData.req_0.data.sip[0]).replace("http://", "https://");

        return data.map((v, i) => ({
            title: v.name || v.title,
            artist: v.artist || v.author,
            src: domain + jsonpData.req_0.data.midurlinfo[i].purl,
            pic: v.pic,
            lrc: v.lrc,
        }));
    } else {
        return data.map((v) => ({
            title: v.name || v.title,
            artist: v.artist || v.author,
            src: v.url,
            pic: v.pic,
            lrc: v.lrc,
        }));
    }
};

/**
 * 一言
 */

// 获取一言数据
export const getHitokoto = async () => {
    const res = await fetch("https://v1.hitokoto.cn");
    return await res.json();
};

/**
 * 每日一句（金山词霸）
 */

// 获取每日一句
export const getDailySentence = async (dateStr) => {
    const res = await fetchJsonp("https://sentence.iciba.com/index.php?c=dailysentence&m=getdetail&title=" + dateStr);
    return await res.json();
}

/**
 * 天气
 */

// 获取高德地理位置信息
export const getAdcode = async (key) => {
    const res = await fetch(`https://restapi.amap.com/v3/ip?key=${key}`);
    return await res.json();
};

// 获取高德地理天气信息
export const getWeather = async (key, city) => {
    const res = await fetch(`https://restapi.amap.com/v3/weather/weatherInfo?key=${key}&city=${city}`);
    return await res.json();
};

/**
 * 获取配置
 */

// 加载数据（外部接口需要配置跨域）
export const loadData = async (url) => {
    const res = await fetch(url);
    return await res.json();
};