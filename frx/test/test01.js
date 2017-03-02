/**
 * Created by Administrator on 2017/2/27.
 */
const should = require('should');



function cleanUrl(url) {
   return url.replace(/(#.+|\W)/g, '');
}

describe('正则', function () {

   it('URL变换', function () {
      let s = cleanUrl('http://www.1m1m.com/test/do?t=abc#there');
      console.log(s);
   })
});