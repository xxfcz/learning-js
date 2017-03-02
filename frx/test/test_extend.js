/**
 * Created by Administrator on 2017/2/27.
 */

describe('extend', function () {

   it('用例1', function () {
      var o1 = {
         x: 1,
         toString: '串'
      };

      var o2 = {
         x: 10,
         y: 20,
         valueOf: '胡说！'
      };

      var o3 = extend(o1, o2);
      expect(o3.valueOf).toEqual('胡说！');
   });

});