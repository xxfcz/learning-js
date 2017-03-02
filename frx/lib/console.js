/**
 * Created by Administrator on 2017/2/27.
 */

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

    var setup = function () {
        window.console = console;
        // flush logs
        if (logs.length > 0) {
            for (var i = 0; i < logs.length; ++i) {
                console.log(logs[i]);
            }
        }
    };

    var addEv = window.addEventListener || window.attachEvent;
    addEv('onload', setup);
})();
