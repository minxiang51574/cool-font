// @ts-nocheck

import _ from "lodash";

export function calcDescartes(array: any[]) {
	if (array.length < 2) return array[0] || [];
	return [].reduce.call(array, function (col, set) {
		const res = [];
		col.forEach(function (c) {
			set.forEach(function (s) {
				const t = [].concat(Array.isArray(c) ? c : [c]);
				t.push(s);
				res.push(t);
			});
		});
		return res;
	});
}

export function getSpec(d) {
	return _.keys(d)
		.filter((e) => e.includes("spec_"))
		.map((e) => d[e])
		.join();
}
