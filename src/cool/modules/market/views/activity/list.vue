<template>
	<cl-crud :ref="setRefs('crud')" @load="onLoad">
		<el-row type="flex" align="middle">
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />
			<cl-flex1 />
			<!-- 关键字搜索 -->
			<cl-search-key />
		</el-row>

		<el-row>
			<!-- 数据表格 -->
			<cl-table :ref="setRefs('table')" v-bind="table">
				<template #column-pic="{ scope }">
					<cl-image :src="scope.row.pic" />
				</template>

				<template #slot-op-btn="{ scope }">
					<el-button size="mini" type="text" @click="toDetail(scope.row)">详情</el-button>
				</template>
			</cl-table>
		</el-row>

		<el-row type="flex">
			<cl-flex1 />
			<!-- 分页控件 -->
			<cl-pagination />
		</el-row>

		<!-- 新增、编辑 -->
		<cl-upsert :ref="setRefs('upsert')" v-bind="upsert" />
	</cl-crud>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { CrudLoad, Upsert, Table } from "cl-admin-crud-vue3/types";
import { useCool } from "/@/core";
import { ActivityType } from "/$/market/dict";

export default defineComponent({
	name: "market-activity-info",

	setup() {
		const { refs, setRefs, service, router } = useCool();

		// 新增、编辑配置
		const upsert = reactive<Upsert>({
			items: [
				{
					label: "活动标题",
					prop: "title",
					component: {
						name: "el-input",
						attrs: {
							placeholder: "请填写活动标题"
						}
					},
					rules: {
						required: true,
						message: "活动标题不能为空"
					}
				},
				{
					label: "活动子标题",
					prop: "subTitle",
					component: {
						name: "el-input",
						attrs: {
							placeholder: "请填写活动子标题"
						}
					},
					rules: {
						required: true,
						message: "活动名子标题能为空"
					}
				},
				{
					label: "活动类型",
					prop: "type",
					component: {
						name: "el-select",
						options: ActivityType
					},
					rules: {
						required: true,
						message: "活动类型不能为空"
					}
				},
				{
					label: "活动详情页",
					prop: "detailPage",
					component: {
						name: "el-select",
						props: {
							clearable: true
						},
						options: [
							{
								label: "默认商品详情",
								value: ""
							},
							{
								label: "测试页",
								value: "/pages/order/list"
							}
						]
					}
				},
				{
					label: "活动封面",
					prop: "pic",
					component: {
						name: "cl-upload"
					}
				},
				{
					label: "活动时间",
					prop: "_date",
					value: [],
					hook: "datetimerange",
					component: {
						name: "el-date-picker",
						props: {
							type: "datetimerange",
							valueFormat: "YYYY-MM-DD HH:mm:ss"
						}
					},
					rules: {
						required: true,
						message: "活动时间不能为空"
					}
				},
				{
					label: "活动状态",
					prop: "status",
					value: 0,
					component: {
						name: "el-radio-group",
						options: [
							{
								label: "关闭",
								value: 0
							},
							{
								label: "开启",
								value: 1
							}
						]
					}
				}
			]
		});

		// 表格配置
		const table = reactive<Table>({
			columns: [
				{
					type: "selection",
					width: 60
				},
				{
					label: "封面",
					prop: "pic",
					minWidth: 120
				},
				{
					label: "标题",
					align: "center",
					prop: "title",
					minWidth: 150,
					showOverflowTooltip: true
				},
				{
					label: "子标题",
					prop: "subTitle",
					minWidth: 150,
					showOverflowTooltip: true
				},
				{
					label: "类型",
					prop: "type",
					minWidth: 100,
					dict: ActivityType
				},
				{
					label: "跳转详情页",
					prop: "detailPage",
					minWidth: 120
				},
				{
					label: "状态",
					prop: "status",
					dict: [
						{
							label: "关闭",
							value: 0,
							type: "danger"
						},
						{
							label: "开启",
							value: 1,
							type: "success"
						}
					],
					minWidth: 100
				},
				{
					label: "开始时间",
					prop: "startTime",
					sortable: "custom",
					minWidth: 150
				},
				{
					label: "结束时间",
					prop: "endTime",
					minWidth: 150
				},
				{
					label: "操作",
					type: "op",
					buttons: ["edit", "delete", "slot-op-btn"]
				}
			]
		});

		// crud 加载
		function onLoad({ ctx, app }: CrudLoad) {
			// 绑定 service
			ctx.service(service.market.activity.info).done();
			app.refresh();
		}

		// 详情
		function toDetail({ id, type }: any) {
			router.push({
				path: "/market/activity/info",
				query: {
					id,
					type
				}
			});
		}

		return {
			refs,
			setRefs,
			upsert,
			table,
			onLoad,
			toDetail
		};
	}
});
</script>
