<template>
	<div class="sales-rank">
		<div class="sales-rank__header">
			<span>商品销售排名</span>
		</div>
		<div class="sales-rank__container">
			<ul class="sales-rank__list" @click="openGoods()">
				<li class="item" v-for="(item, index) in data" :key="index + 1">
					<span>{{ index + 1 }}</span>
					<span>{{ item.title }}</span>
					<span>{{ item.count }}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from "vue";
import { useCool } from "/@/core";

export default defineComponent({
	setup() {
		const service = inject<any>("service");
		const data = ref<Array<any>>([]);
		service.orderHome.goodsbuyNum().then((res: any) => {
			data.value = res;
		});
		const { router } = useCool();
		function openGoods() {
			router.push({
				path: "/goods/info",
				query: {}
			});
		}
		return { router, openGoods, data };
	}
});
</script>

<style lang="scss" scoped>
.sales-rank {
	&__header {
		display: flex;
		align-items: center;
		height: 50px;
		font-size: 15px;
		font-weight: bold;
		padding: 0 20px;
	}

	&__container {
		padding: 0 20px;
		height: 300px;
	}

	&__list {
		height: 250px;

		li {
			display: flex;
			align-items: center;
			height: 60px;
			list-style: none;
			font-size: 13px;
			cursor: pointer;

			span {
				&:first-child {
					display: inline-block;
					height: 14px;
					width: 14px;
					border-radius: 14px;
					text-align: center;
					line-height: 14px;
					font-size: 12px;
				}

				&:nth-child(2) {
					flex: 1;
					margin: 0 10px;
					letter-spacing: 0.5px;
					color: #222;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
				}
			}

			&:nth-last-child(n + 3) {
				span {
					&:first-child {
						background-color: #000;
						color: #fff;
					}
				}
			}

			&:hover {
				span:nth-child(2) {
					text-decoration: underline;
				}
			}
		}
	}
}
</style>
