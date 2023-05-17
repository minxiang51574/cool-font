<template>
	<div class="view-activity-info">
		<el-tabs v-model="tabs.value" type="card">
			<el-tab-pane
				:label="item.label"
				:name="item.value"
				v-for="item in tabs.list"
				:key="item.value"
				lazy
			>
				<view class="container">
					<component :is="item.component.name" v-bind="item.component.props" />
				</view>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { useCool } from "/@/core";
import ButieConfig from "../../components/activity/butie/config.vue";
import ButieGoods from "../../components/activity/butie/goods.vue";
import { href } from "/@/core/utils";

export default defineComponent({
	components: {
		ButieConfig,
		ButieGoods
	},

	setup() {
		const { route } = useCool();
		const { id, type } = route.query;

		if (!id) {
			href("/market/activity/list");
		}

		// 活动类型枚举
		enum ActivityTypeEnum {
			"butie" = 0
		}

		// 活动名称
		const name = ActivityTypeEnum[Number(type)];

		// 选项栏
		const tabs = reactive<any>({
			value: "goods",
			list: [
				{
					label: "活动商品",
					value: "goods",
					component: {
						name: "goods"
					}
				},
				{
					label: "活动配置",
					value: "config",
					component: {
						name: "config"
					}
				}
			],
			conf: {
				butie: {
					list: []
				}
			}
		});

		// 匹配活动
		tabs.list.map((e: any) => {
			if (e.component && e.component.name) {
				e.component.name = name + "-" + e.component.name;
			}
		});

		// 添加活动配置
		tabs.list.unshift(...tabs.conf[name].list);

		// 默认值
		tabs.value = tabs.list[0].value;

		return {
			tabs
		};
	}
});
</script>

<style lang="scss" scoped>
.view-activity-info {
	padding: 10px;
	background-color: #fff;
	box-sizing: border-box;

	:deep(.el-tabs) {
		height: 100%;

		.el-tabs__content {
			height: calc(100% - 60px);
		}
	}

	:deep(.el-tab-pane) {
		height: 100%;

		.container {
			height: 100%;

			& > div {
				height: 100%;
			}

			.cl-crud {
				padding: 0;
			}
		}
	}
}
</style>
