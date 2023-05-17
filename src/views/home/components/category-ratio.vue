<template>
	<div class="category-ratio">
		<div class="category-ratio__header">
			<span>销售类别占比</span>
		</div>

		<div class="category-ratio__container">
			<v-chart :option="chartOption" autoresize />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, inject, onMounted } from "vue";

export default defineComponent({
	setup() {
		const chartOption = reactive({
			tooltip: {
				trigger: "item",
				formatter: "{a} <br/>{b}: {c} ({d}%)"
			},
			legend: {
				bottom: 30,
				left: "center"
			},

			series: [
				{
					name: "销售量",
					type: "pie",
					radius: ["50%", "60%"],
					center: ["50%", "40%"],
					avoidLabelOverlap: false,
					hoverAnimation: false,
					label: {
						show: false,
						position: "center"
					},
					emphasis: {
						label: {
							show: true,
							fontSize: "30",
							fontWeight: "bold"
						}
					},
					labelLine: {
						show: false
					},
					data: [],
					itemStyle: {
						normal: {
							borderColor: "#fff",
							borderWidth: 4
						}
					},
					roundCap: 1
				}
			]
		});
		// 请求服务
		const service = inject<any>("service");
		onMounted(() => {
			service.orderHome.getType({ page: 1, size: 15 }).then((res: any) => {
				chartOption.series[0].data = res.list.map((e: any) => {
					e.name, (e.value = e.count);
					return e;
				});
			});
		});

		return {
			chartOption
		};
	}
});
</script>

<style lang="scss" scoped>
.category-ratio {
	&__header {
		display: flex;
		align-items: center;
		height: 50px;
		font-size: 15px;
		font-weight: bold;
		padding: 0 20px;
	}

	&__container {
		height: 415px;
		padding: 0 20px;
		box-sizing: border-box;

		.echarts {
			width: 100%;
		}
	}
}
</style>
