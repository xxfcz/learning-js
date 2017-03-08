/**
 * Created by Administrator on 2017/2/27.
 */

(function () {
    if (typeof window.console !== 'undefined')
        return;

    var logs = [];

    var collector = {
        log: function () {
            logs.push({
                type: 'log',
                text: [].slice.call(arguments).join(' ')
            });
        },
        info: function () {
            logs.push({
                type: 'info',
                text: [].slice.call(arguments).join(' ')
            });
        }
    };

    var console = {
        log: function () {
            var text = [].slice.call(arguments).join(' ');
            var el = document.createElement('div');
            el.innerText = text;
            el.className = 'console log';
            document.body.appendChild(el);
            return el;
        },

        info: function () {
            var text = [].slice.call(arguments).join(' ');
            var el = document.createElement('div');
            el.innerText = text;
            el.className = 'console info';
            el.style.color = 'blue';
            document.body.appendChild(el);
            return el;
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
                var log = logs[i];
                switch(log.type) {
                    case 'log':
                        console.log(log.text);
                        break;
                    case 'info':
                        console.info(log.text);
                        break;
                    default:
                        break;
                }
            }
        }
    };

    //var addEv = window.addEventListenerwindow.addEventListener || window.attachEvent;
    //addEv('onload', setup);
    window[window.addEventListener ? 'addEventListener' : 'attachEvent']('onload', setup);
})();
