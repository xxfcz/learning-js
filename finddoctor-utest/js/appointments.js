/**
 * Created by xxf on 2015/12/24.
 */

var appointments = (function namespace() {

	// 整理排班计划，按日期合并、按时刻排序
	function marshallPlans(plans) {
		//按日期去重复并排序
		plans = plans.unique(function (e1, e2) {
			return e1.date.localeCompare(e2.date);
		}, function (slice) {
			// 把同一日期的时段进行合并
			return slice.reduce(function (a, b) {
				b.hours.forEach(function (e) {
					a.hours.push(e)
				});
				return a;
			});
		});
		plans.forEach(function (plan) {
			// 把各天内的时段分别进行排序
			plan.hours = plan.hours.sort(function (a, b) {
				return new String(a.time).localeCompare(b.time);
			});
			//添加星期
			plan.day = new Date(plan.date).getDay();
		});
		return plans;
	}

	function makeCells(plans) {
		// 找出连续几个星期的首尾日期，该日期范围可覆盖所有排班日期
		var d = new Date(plans[0].date.replace(/-/g,"/"));
		var today = new Date();
		if(today < d) {
			d = new Date(today.getFullYear(), today.getMonth(), today.getDate());      // 调整首日期，使日历包含今天
		}
		var n = d.getDay();
		var from = d.addDays(-n);   // 首日期
		d = new Date(plans[plans.length - 1].date.replace(/-/g,"/"));
		d.setHours(0);
		n = d.getDay();
		var to = d.addDays(6 - n);  // 尾日期

		// 生成日历网格，并附上排班计划
		var cells = [];
		for (d = from; d <= to; d = d.addDays(1)) {
			var cell = {};
			cell.d = d;

			// 在排班中查找该日期
			(function (date) {
				var plan = plans.search(function (plan) {
					return plan.date == date.format("yyyy-MM-dd");
				});
				if (plan)
					cell.plan = plan;   // 该天有排班，附上去
			}(d)); // 增加一层闭包，以捕获循环变量d

			cells.push(cell);
		}
		return cells;
	}

	// 由一维数组生成二维数组，每行7列
	function makeWeeks(cells) {
		var weeks = [];
		var rowCount = cells.length / 7; // 只考虑是7的倍数
		for (var row = 0; row < rowCount; ++row) {
			var week = [];
			for (var col = 0; col < 7; ++col) {
				week.push(cells[row * 7 + col]);
			}
			weeks.push(week);
		}
		return weeks;
	}


	function makeCalendar(plans) {
		var result = marshallPlans(plans);
		result = makeCells(result);
		result = makeWeeks(result);
		return result;
	}


	return {
		makeCalendar: makeCalendar
	}

}());

