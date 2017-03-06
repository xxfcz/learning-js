/**
 * Created by Administrator on 2017/3/6.
 */

var DOC = document;
var W3C = typeof window.dispatchEvent !== 'undefined';
var head = DOC.head || DOC.getElementsByTagName("head")[0]; //HEAD元素
var moduleClass = "xlib" + (new Date - 0);

var slice = W3C ? function (nodes, start, end) {
    return factorys.slice.call(nodes, start, end);
} : function (nodes, start, end) {
    var ret = [],
        n = nodes.length;
    if (end === void 0 || typeof end === "number" && isFinite(end)) {
        start = parseInt(start, 10) || 0;
        end = end == void 0 ? n : parseInt(end, 10);
        if (start < 0) {
            start += n;
        }
        if (end > n) {
            end = n;
        }
        if (end < 0) {
            end += n;
        }
        for (var i = start; i < end; ++i) {
            ret[i - start] = nodes[i];
        }
    }
    return ret;
};

function getCurrentScript(base) {
    // 参考 https://github.com/samyk/jiagra/blob/master/jiagra.js
    var stack;
    try {
        a.b.c(); //强制报错,以便捕获e.stack
    } catch (e) { //safari的错误对象只有line,sourceId,sourceURL
        stack = e.stack;
        if (!stack && window.opera) {
            //opera 9没有e.stack,但有e.Backtrace,但不能直接取得,需要对e对象转字符串进行抽取
            stack = (String(e).match(/of linked script \S+/g) || []).join(" ");
        }
    }
    if (stack) {
        stack = stack.split(/[@ ]/g).pop(); //取得最后一行,最后一个空格或@之后的部分
        stack = stack[0] === "(" ? stack.slice(1, -1) : stack.replace(/\s/, ""); //去掉换行符
        return stack.replace(/(:\d+)?:\d+$/i, ""); //去掉行号与或许存在的出错字符起始位置
    }
    else {
        console.log('NO Stack!');
    }
    var nodes = (base ? document : head).getElementsByTagName("script"); //只在head标签中寻找
    for (var i = nodes.length, node; node = nodes[--i];) {
        if ((base || node.className === moduleClass) && node.readyState === "interactive") {
            return node.className = node.src;
        }
    }

    console.log('在 document.scripts 中寻找');
    return $.slice(document.scripts).pop().src;
}

(function () {
    var cur = src = getCurrentScript(true);
    console.log('getCurrentScript: ' + cur);

    var basepath;
    // 若无完整路径，则补充之
    if (cur.substring(0, 4) !== 'http') {
        basepath = location.href.slice(0, location.href.lastIndexOf('/') + 1);
        cur = basepath + cur;
    }

    var url = cur.replace(/[?#].*/, "");  // 去掉末尾的hash分片和查询字符串
    console.log('url：', url);
    var basepath = url.slice(0, url.lastIndexOf("/") + 1);
    console.log('basePath：', basepath);

    // 处理昵称
    var nick;
    var scripts = DOC.getElementsByTagName("script");
    for (var i = 0, el; el = scripts[i++];) {
        if (el.src === src) {
            nick = el.getAttribute("data-nick") || "$";
            break;
        }
    }
    console.log('nick:', nick);
})();


