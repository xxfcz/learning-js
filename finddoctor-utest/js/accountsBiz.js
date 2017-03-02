/**
 * Created by xxf on 2016/1/8.
 */

// 优惠券
function Coupon(d) {
	angular.extend(this, d);
	this.id = d.id;
	this.trophyID = d.trophyID;
	this.trophyType = d.trophyType;
	this.couponRate = d.couponRate;
	this.useLimitService = d.useLimitService;
	this.couponAmount = d.couponAmount;
	this.validBeginTime = new Date(d.validBeginTime);
	this.validEndTime = new Date(d.validEndTime);
	this.topAmount = d.topAmount;   // 优惠券的折扣上限（元），TrophyType=1时有效，0表示无上限
	this.userLimitSource = d.userLimitSource;
	this.state = d.state;
	this.useLimitAmount = d.useLimitAmount; // 优惠券的使用下限（元），总金额大于等于此值时才能使用此优惠券，0表示无下限
}


Coupon.SERVICE_ANY = 0;
Coupon.SERVICE_RESERVE = 1;
Coupon.SERVICE_APPOINTMENT = 2;
Coupon.SERVICE_CONSULT = 3;
Coupon.SERVICE_TYPES = ["", "预约挂号", "约名医", "名医在线"]; // 使用的业务限制：0表示不限，1-预约挂号，2-约名医，3-名医在线

Coupon.TROPHY_DISCOUNT = 2;
Coupon.TROPHY_DEDUCTION = 3;
Coupon.TROPHY_TYPES = ["未知", "实物奖口", "折扣券", "抵扣券"];    // 奖品类型：0-未知，1-实物奖品，2-折扣券，3-抵扣券

Coupon.STATE_USABLE = 1;    // 可用
Coupon.STATE_USED = 2;      // 已用
Coupon.STATE_EXPIRED = 3;   // 过期

Coupon.prototype.toString = function () {
	var result = "";
	switch (this.trophyType) {
		case Coupon.TROPHY_DISCOUNT: // 折扣券
			if (this.couponRate == 0)
				result = "免费" + this.getServiceName() + "券";
			else
				result = this.couponRate / 10 + "折" + this.getServiceName() + "券";
			break;
		case Coupon.TROPHY_DEDUCTION: // 抵扣券
			result = this.couponAmount + "元" + this.getServiceName() + "券";
			break;
		default:
			result = this.getServiceName();
			break;
	}
	return result;
};


// 奖品类型
Coupon.prototype.getTrophyName = function () {
	var i = this.trophyType;
	return i >= 0 && i < Coupon.TROPHY_TYPES.length ? Coupon.TROPHY_TYPES[i] : "未知奖品";
};


// 业务类型
Coupon.prototype.getServiceName = function () {
	var i = this.useLimitService;
	return i >= 0 && i < Coupon.SERVICE_TYPES.length ? Coupon.SERVICE_TYPES[i] : "未知业务";
};


// 有效期描述
Coupon.prototype.getEndTime = function () {
	return this.validEndTime.format("yyyy/MM/dd");
};


// 单位
Coupon.prototype.getUnit = function () {
	switch (this.trophyType) {
		case Coupon.TROPHY_DISCOUNT:
			return "折";
			break;
		case Coupon.TROPHY_DEDUCTION:
			return "元";
			break;
		default:
			return "";
			break;
	}
};

// 面额描述
Coupon.prototype.getValue = function () {
	switch (this.trophyType) {
		case Coupon.TROPHY_DISCOUNT:
			return this.couponRate / 10;
			break;
		case Coupon.TROPHY_DEDUCTION:
			return this.couponAmount;
			break;
		default:
			return "无";
			break;
	}
};


// 用法/限制说明
Coupon.prototype.getUsage = function () {
	var r1, r2;

	if (this.useLimitService == Coupon.SERVICE_RESERVE) {
		r1 = "挂号抵扣" + this.couponAmount + "元";
		r2 = "限广州地区支持线上支付的医院";
	}
	else {
		r1 = "最高抵扣" + this.topAmount + "元";
		r2 = "限广州地区使用";
	}

	return r1 + "，" + r2;
};


function translateServiceType(clinicService) {
	const SERVICE_MAP = [Coupon.SERVICE_RESERVE, -1, Coupon.SERVICE_APPOINTMENT, -1, -1, Coupon.SERVICE_CONSULT];
	if (clinicService == "all" || clinicService < 0 || clinicService > 5)
		return Coupon.SERVICE_ANY;
	return SERVICE_MAP[clinicService];
}


/*
 * 能否用于指定的支付
 * @param couponService: 优惠券业务类型，取值 Coupon.SERVICE_XXX 系列（0=所有，...）
 * @param amount: 金额
 * @returns true/false
 */
Coupon.prototype.canUse = function (couponService, amount) {
	if (arguments.length < 2) {
		error("必须提供两个参数：couponService, amount");
	}

	// 未使用的
	var unused = this.state == 0;
	// 业务类型要相符
	var rightService = this.useLimitService == Coupon.SERVICE_ANY || this.useLimitService == couponService;
	// 仍在有效期内
	var today = new Date().format("yyyy-MM-dd");
	var valid = this.validBeginTime.format("yyyy-MM-dd") <= today && today <= this.validEndTime.format("yyyy-MM-dd");
	// 可用于App
	var forApp = this.userLimitSource == 0 || this.userLimitSource == 3;
	// 满足使用下限
	var limit = this.useLimitAmount == 0 || this.useLimitAmount <= amount;

	return unused && rightService && valid && forApp && limit;
};

// 是否过期
Coupon.prototype.getExpired = function () {
	return this.validEndTime < new Date();
};

// 是否已用过
Coupon.prototype.getUsed = function () {
	return this.state == 1;
};


// 状态
Coupon.prototype.getState = function () {
	if (this.getUsed())
		return Coupon.STATE_USED;
	else if (this.getExpired())
		return Coupon.STATE_EXPIRED;
	else
		return Coupon.STATE_USABLE;
};

// 状态描述：已过期、已使用、等等
Coupon.prototype.getStateText = function () {
	switch (this.getState()) {
		case Coupon.STATE_USABLE:
			return "立即使用";
		case Coupon.STATE_USED:
			return "已经使用";
		case Coupon.STATE_EXPIRED:
			return "已经过期";
		default:
			return "";
	}
};

/**
 *  计算优惠额度
 * @param price 应付总金额
 */
Coupon.prototype.getDeduction = function (price) {
	// 下限
	if (this.useLimitAmount != 0 && this.useLimitAmount > price)
		return 0;

	var result = 0;
	switch (this.trophyType) {
		case Coupon.TROPHY_DISCOUNT: // 折扣券
			if (this.couponRate == 0)   // 免费券?
				result = price;
			else
				result = price * (1 - this.couponRate / 100);
			break;
		case Coupon.TROPHY_DEDUCTION: // 抵扣券
			result = this.couponAmount;
			break;
		default:
			result = this.getServiceName();
			break;
	}

	// 天花板
	if (this.topAmount > 0 && this.topAmount < result) {
		result = this.topAmount;
	}

	return result;
};


/**
 * 计算实付金额
 * @param price 应付金额
 */
Coupon.prototype.getExpense = function (price) {
	var result = price - this.getDeduction(price);
	if (result < 0)
		result = 0;
	return result;
};

