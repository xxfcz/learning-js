/**
 * Created by Administrator on 2017/2/27.
 */

/*

// TODO: 兼容IE6

(function () {
    if (typeof window.console !== 'undefined')
        return;


    var logs = [];

    var collector = {
        log: function () {
            logs.push([].slice.call(arguments).join(' '));
        }
    };

    var console = {
        log: function () {
            var text = [].slice.call(arguments).join(' ');
            var el = document.createElement('div');
            el.innerText = text;
            document.body.appendChild(el);
        }
    };

    // 还没有 body
    if (!document.body) {
        // 使用暂存版console
        window.console = collector;
    }

    // 保存之前的 window.onload
    var onload_saved = window.onload;

    window.onload = function () {
        window.console = console;
        if (logs.length > 0) {
            for (var i = 0; i < logs.length; ++i) {
                console.log(logs[i]);
            }
        }

        if (onload_saved)
            onload_saved();
    }
})();
*/


(function () {
    if (typeof window.console === 'undefined') {
        window.console = {
            log: function () {
                var text = [].slice.call(arguments).join(' ');
                var el = document.createElement('div');
                el.innerText = text;
                document.body.appendChild(el);
            }
        }
    }
})();

