<template>
	<div class="count-effect">
		<div class="card" @click="openOrder()">
			<div class="card__header">
				<span class="label">总收入</span>
				<span class="value">￥{{ total || 0 }}</span>
			</div>

			<div class="card__footer">
				<ul class="count-effect__cop">
					<li>
						<span>周同比</span>

						<div class="rise" v-if="weetData.showWeet">
							<i class="el-icon-top-right"></i>
							<span>{{ weetData.weetThan }}%</span>
						</div>
						<div class="fall" v-else>
							<i class="el-icon-bottom-right"></i>
							<span>{{ weetData.weetThan }}%</span>
						</div>
					</li>

					<li>
						<span>日同比</span>
						<div class="rise" v-if="dayData.showday">
							<i class="el-icon-top-right"></i>
							<span>{{ dayData.dayThan }}%</span>
						</div>
						<div class="fall" v-else>
							<i class="el-icon-bottom-right"></i>
							<span>{{ dayData.dayThan }}%</span>
						</div>
					</li>
				</ul>
			</div>
			<div class="card__footer">
				<span class="label">年销售额</span>
				<span class="value">￥{{ yearTotal || 0 }}</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, inject, ref } from "vue";
import { useCool } from "/@/core";
export default defineComponent({
	setup() {
		let total = ref<Number>(0);
		let yearTotal = ref<Number>(0);
		let weetData = ref<any>({});
		let dayData = ref<any>({});
		const service = inject<any>("service");
		onMounted(() => {
			service.totalTurnover.getVipToral().then((res: any) => {
				total.value = res.total;
				yearTotal.value = res.yearTotal;
			});
			// 获得周比
			service.totalTurnover.getWeekMoney().then((res: any) => {
				weetData.value = res;
			});
			// 获得日比
			service.totalTurnover.getDayMoney().then((res: any) => {
				dayData.value = res;
			});
		});
		const { router } = useCool();
		function openOrder() {
			router.push({
				path: "/order/info",
				query: {}
			});
		}
		return { router, openOrder, total, weetData, dayData, yearTotal };
	}
});
</script>

<style lang="scss" scoped>
.count-effect {
	&__cop {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;

		li {
			display: flex;
			list-style: none;
			flex: 1;
			color: #d8d8d8;

			.fall,
			.rise {
				display: flex;
				align-items: center;
				margin-left: 10px;
			}

			.fall {
				color: #13ae7c;
			}

			.rise {
				color: #f21e37;
			}
		}
	}

	.card__container {
		padding-top: 15px;
		padding-right: 10px;
		box-sizing: border-box;
	}
}
</style>
