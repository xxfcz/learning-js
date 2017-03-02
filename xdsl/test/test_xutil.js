/**
 * Created by Administrator on 2017/2/27.
 */

const x = require('../lib/xutil');

describe('xutil', function () {

   it('extend', function () {
      var o1 = {
         x: 1,
         toString:  '串'
      };

      var o2 = {
         x: 10,
         y: 20,
         valueOf: '胡说！'
      };

      var o3 = x.extend(o1, o2);
      console.log(o3);
   })

});