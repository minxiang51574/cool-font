<template>
	<div class="activity-butie-goods">
		<base-goods :conf="conf" />
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import BaseGoods from "../base/goods.vue";

export default defineComponent({
	name: "activity-butie-goods",

	components: {
		BaseGoods
	},

	setup() {
		const conf = reactive<any>({
			spec: true,
			form: [
				{
					label: "补贴金",
					prop: "subsidyMoney",
					span: 8,
					component: {
						name: "el-input"
					},
					rules: {
						required: true,
						message: "补贴金不能为空"
					}
				},
				{
					label: "限制数量",
					prop: "limitCount",
					flex: false,
					component: {
						name: "el-input-number",
						props: {
							min: 1,
							max: 100000
						}
					},
					rules: {
						required: true,
						message: "限制数量不能为空"
					}
				},
				{
					label: "用户限制数量",
					prop: "userLimitCount",
					flex: false,
					component: {
						name: "el-input-number",
						props: {
							min: 1,
							max: 100000
						}
					},
					rules: {
						required: true,
						message: "用户限制数量不能为空"
					}
				}
			]
		});

		return {
			conf
		};
	}
});
</script>

<style lang="scss" scoped>
.limit-tips {
	font-size: 12px;
	color: red;
}
</style>
