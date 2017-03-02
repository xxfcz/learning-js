/**
 * Created by Administrator on 2016/4/12.
 */

describe("SMD", function () {

	beforeAll(function () {
		F.define('string', function () {
			return {
				trim: function (str) {
					return str.replace(/^\s+|\s+$/g, '');
				}
			}
		});

		F.define("module1");

		F.define("level1.level2");

		F.define('dom', function () {
			return {};
		});
	});

	describe("define", function () {
		it("定义单级模块", function () {
			expect(F.module1).toBeDefined();
		});
		it("定义两级模块", function () {
			expect(F.level1).toBeDefined();
			expect(F.level1.level2).toBeDefined();
			console.log(F);
		});

	});

	it("string.trim", function () {
		var s = F.string.trim(" ABC ");
		expect(s).toEqual("ABC");
	});

	describe("module", function () {

		it("使用'dom'模块和document对象", function () {
			var foo = {
				bar: function (dom, document) {
				}
			};

			spyOn(foo, 'bar').and.callThrough();

			F.module(['dom', document], foo.bar);
			expect(foo.bar).toHaveBeenCalledWith(F.dom, document);
		});
	});
});