/**
 * Created by xxf on 2016/1/8.
 */

// 优惠券
function Coupon(d) {
	angular.extend(this, d);

	this.toString = function () {
		const SERVICES = ["", "预约挂号", "约名医", "名医在线"]; // 使用的业务限制：0表示不限，1-预约挂号，2-约名医，3-名医在线
		const TROPHY_TYPES = ["未知", "实物奖口", "券", "券"];    // 奖品类型：0-未知，1-实物奖品，2-折扣券，3-抵扣券
		var result = "";
		var i = this.useLimitService;
		var serviceName = i >= 0 && i < SERVICES.length ? SERVICES[i] : "未知业务";
		i = this.trophyType;
		var trophyName = i >= 0 && i < TROPHY_TYPES.length ? TROPHY_TYPES[i] : "未知奖品";
		switch (this.trophyType) {  // 奖品类型：0-未知，1-实物奖品，2-折扣券，3-抵扣券
			case 2: // 折扣券
				if (this.couponRate == 0)
					result = "免费" + serviceName + "券";
				else
					result = this.couponRate/10 + "折" + serviceName + "券";
				break;
			case 3: // 抵扣券
				result = this.couponAmount + "元" + serviceName + "抵扣券";
				break;
			default:
				result = trophyName;
				break;
		}
		return result;
	}
}
