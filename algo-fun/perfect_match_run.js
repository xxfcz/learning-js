/**
 * Created by Administrator on 2016/9/29.
 */

const pm = require('./lib/perfect_match');
var Partner = pm.Partner;

var boys, girls;


girls = [
	new Partner({ name: 'A', prefs: [2, 3, 1, 0] }),
	new Partner({ name: 'B', prefs: [2, 1, 3, 0] }),
	new Partner({ name: 'C', prefs: [0, 2, 3, 1] }),
	new Partner({ name: 'D', prefs: [1, 3, 2, 0] })
];

boys = [
	new Partner({ name: 'a', prefs: [0, 3, 2, 1] }),
	new Partner({ name: 'b', prefs: [0, 1, 2, 3] }),
	new Partner({ name: 'c', prefs: [0, 2, 3, 1] }),
	new Partner({ name: 'd', prefs: [1, 0, 3, 2] })
];


console.log('男追女：');
if (pm.galeShapley(boys, girls))
	pm.printResult(boys, girls);

console.log('女追男：');
if (pm.galeShapley(girls, boys))
	pm.printResult(boys, girls);
