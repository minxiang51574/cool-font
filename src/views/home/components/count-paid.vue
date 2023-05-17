<template>
	<div class="count-paid">
		<div class="card">
			<div class="card__header">
				<span class="value">日订单</span>
				<!-- <span class="value">{{ total }}</span> -->
			</div>

			<div class="card__container">
				<v-chart :option="chartOption" autoresize @click="openOrder()" />
			</div>

			<div class="card__footer">
				<span class="label">日销售额</span>
				<span class="value">￥{{ dayOrder }}</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, inject, onMounted, ref } from "vue";
import { useCool } from "/@/core";

export default defineComponent({
	setup() {
		const chartOption = reactive({
			grid: {
				left: "10%",
				top: 0,
				right: "10%",
				bottom: 0
			},
			xAxis: {
				type: "category",
				data: ["00:00", "2:00", "4:00", "6:00", "8:00", "10:00", "12:00", "14:00"],
				boundaryGap: false
			},
			tooltip: {
				trigger: "axis",
				formatter: (comp: any) => {
					// const [serie, money] = comp;
					const serie = comp[0];
					// const day = comp[2];
					// ${day.seriesName}：${day.value}
					return `  ${serie.seriesName}：${serie.value}  `;
				}
			},
			yAxis: {
				type: "value",
				splitLine: {
					show: false
				},
				axisTick: {
					show: false
				},
				axisLine: {
					show: false
				},
				axisLabel: {
					show: false
				}
			},
			series: [
				{
					barWidth: 18,
					name: "日金额",
					type: "bar",
					data: [81, 24, 77, 13, 87, 92, 68, 55],
					itemStyle: {
						normal: {
							color: "#4165d7"
						}
					}
				},
				{
					type: "bar",
					barWidth: 18,
					xAxisIndex: 0,
					barGap: "-100%",
					data: [100, 100, 100, 100, 100, 100, 100, 100],
					itemStyle: {
						normal: {
							color: "#f1f1f9"
						}
					},
					zlevel: -1
				},
				{
					name: "日期",
					type: "bar",
					data: [],
					label: {
						show: true,
						position: "top"
					},
					itemStyle: {
						normal: {
							color: "#4165d7"
						}
					}
				}
			]
		});
		let total = ref<Number>(0);
		let dayOrder = ref<Number>(0);
		// 请求服务
		const service = inject<any>("service");
		onMounted(() => {
			service.orderHome.orderDayChart({ dayCount: 7 }).then((res: any) => {
				chartOption.xAxis.data = res.dates;
				chartOption.series[0].data = res.datas;
				chartOption.series[2].data = res.dates;
				total.value = res.total;
				dayOrder.value = res.dayOrder;
			});
		});

		const { router } = useCool();
		function openOrder() {
			router.push({
				path: "/order/info",
				query: {}
			});
		}

		return {
			router,
			openOrder,
			chartOption,
			dayOrder,
			total
		};
	}
});
</script>

<style lang="scss" scoped>
.count-sales {
	.card {
		.echarts {
			height: 50px;
			width: 100%;
		}

		&__container {
			padding: 0;
		}
	}
}
</style>
