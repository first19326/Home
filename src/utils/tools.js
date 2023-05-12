const colors = {
    'gray': 'color: #1B2B34; font-size: 12px; line-height: 18px;',
    'red': 'color: #EC5F67; font-size: 12px; line-height: 18px;',
    'orange': 'color: #F99157; font-size: 12px; line-height: 18px;',
    'yellow': 'color: #FAC863; font-size: 12px; line-height: 18px;',
    'green': 'color: #99C794; font-size: 12px; line-height: 18px;',
    'teal': 'color: #5FB3B3; font-size: 12px; line-height: 18px;',
    'blue': 'color: #6699CC; font-size: 12px; line-height: 18px;',
    'purple': 'color: #C594C5; font-size: 12px; line-height: 18px;',
    'brown': 'color: #AB7967; font-size: 12px; line-height: 18px;'
};

// 获取随机数
export const randomNum = function(minNum, maxNum) {
    switch(arguments.length){
        case 1:
            return parseInt(Math.random() * minNum + 1);
            break;
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum);
            break;
        default:
            return 0;
            break;
    }
};

// 获取当前日期 年-月-日
export const getNowFormatDate = function() {
    let date = new Date();
    let seperator = '-';
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = '0' + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate;
    }
    return year + seperator + month + seperator + strDate;
};

// 控制台输出内容
export const consoleText = function(list, mode) {
       
    switch (mode) {
        case 'random':
            let colorArr = [colors.red, colors.orange, colors.yellow, colors.green, colors.teal, colors.blue, colors.purple, colors.brown];
            list.forEach(function (item) {
                let str = (item).toString();
                let index = randomNum(0, colorArr.length - 1);
                console.info('%c' + str, colorArr[index]);
            });
            break;
        case 'banner':
            list.forEach(function (item) {
                let arr = item;
                console.info('\n' + ' %c ' + (arr[0]) + ' %c ' + (arr[1]) + ' ' + '\n', 'color: #FADFA3; background: #030307; padding: 5px 0;', 'background: #FADFA3; padding: 5px 0;');
            });
            break;
        default:
            console.info('%c' + list.join('\n'), colors.gray);
            break;
    }
};