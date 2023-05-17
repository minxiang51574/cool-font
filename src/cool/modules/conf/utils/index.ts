import flat from "array.prototype.flat";

export function dataset(obj: any, key: string, value: any, isMerge?: boolean): any {
	const isGet = value === undefined;
	let d = obj;

	const arr = flat(
		key.split(".").map((e) => {
			if (e.includes("[")) {
				return e.split("[").map((e) => e.replace(/"/g, ""));
			} else {
				return e;
			}
		})
	);

	try {
		for (let i = 0; i < arr.length; i++) {
			const e: any = arr[i];
			let n: any = 0;

			if (e.includes("]")) {
				const [k, v] = e.replace("]", "").split(":");

				if (v) {
					n = d.findIndex((x: any) => x[k] == v);
				} else {
					n = Number(k);
				}
			} else {
				n = e;
			}

			if (i != arr.length - 1) {
				d = d[n];
			} else {
				if (isGet) {
					return d[n];
				} else {
					if (isMerge) {
						Object.assign(d[n], value);
					} else {
						d[n] = value;
					}
				}
			}
		}

		return obj;
	} catch (e) {
		console.error("格式错误", `${key}`);
		return {};
	}
}
