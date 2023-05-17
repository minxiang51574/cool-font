<template>
	<cl-crud :ref="setRefs('crud')" @load="onLoad">
		<el-row type="flex" align="middle">
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<cl-query
				field="status"
				:list="[
					{ label: '全部', value: null },
					{ label: '退款中', value: 1 },
					{ label: '已退款', value: 2 },
					{ label: '已拒绝', value: 3 }
				]"
			/>
			<!-- 时间筛选 -->
			<cl-filter label="时间筛选">
				<el-date-picker
					v-model="selects.date"
					unlink-panels
					type="datetimerange"
					range-separator="至"
					size="mini"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					:default-time="[
						new Date(2000, 1, 1, 0, 0, 0),
						new Date(2000, 2, 1, 23, 59, 59)
					]"
					@change="onDateChange"
				/>
			</cl-filter>
			<cl-flex1 />
			<!-- 关键字搜索 -->
			<cl-search-key />
		</el-row>

		<el-row>
			<!-- 数据表格 -->
			<cl-table :ref="setRefs('table')" v-bind="table">
				<!-- 商品信息 -->
				<template #column-goodsInfo="{ scope }">
					<goods-info :value="scope.row" />
				</template>
				<!-- 图片描述 -->
				<template #column-refundPics="{ scope }">
					<cl-image v-if="scope.row.refundPics" :size="80" :src="scope.row.refundPics" />
				</template>
				<!-- 反馈按钮 -->
				<template #slot-op-feedback="{ scope }">
					<div v-if="scope.row.status == 1">
						<el-button type="text" size="mini" @click="rowPass(scope.row.id)"
							>通过</el-button
						>
						<el-button type="text" size="mini" @click="rowReject(scope.row.id)"
							>拒绝</el-button
						>
					</div>
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
import GoodsInfo from "/$/goods/components/info.vue";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";

export default defineComponent({
	components: {
		GoodsInfo
	},

	setup() {
		const { refs, setRefs, service } = useCool();

		const selects = reactive<any>({
			date: []
		});

		// 新增、编辑配置
		const upsert = reactive<Upsert>({
			items: []
		});

		// 表格配置
		const table = reactive<Table>({
			props: {
				"default-sort": {
					prop: "status",
					order: "center"
				}
			},
			columns: [
				{
					type: "index",
					label: "#"
				},
				{
					label: "订单号",
					prop: "orderNum",
					minWidth: 200
				},
				{
					label: "商品信息",
					prop: "goodsInfo",
					minWidth: 300
				},
				{
					label: "退款金额",
					prop: "refundAmount",
					minWidth: 120
				},
				{
					label: "退款原因",
					prop: "refundReason",
					minWidth: 160
				},
				{
					label: "退款说明",
					prop: "remark",
					minWidth: 120
				},
				{
					label: "图片描述",
					prop: "refundPics",
					minWidth: 120
				},
				{
					label: "退款状态",
					prop: "status",
					minWidth: 120,
					fixed: "right",
					dict: [
						{
							label: "退款中",
							value: 1
						},
						{
							label: "退款成功",
							value: 2,
							type: "success"
						},
						{
							label: "退款失败",
							value: 3,
							type: "danger"
						}
					]
				},
				{
					label: "退款时间",
					prop: "refundTime",
					sortable: "custom",
					minWidth: 150
				},
				{
					label: "申请时间",
					prop: "refundApplyTime",
					sortable: "custom",
					minWidth: 150
				},
				{
					type: "op",
					buttons: ["slot-op-feedback"],
					width: 120
				}
			]
		});

		// crud 加载
		function onLoad({ ctx, app }: CrudLoad) {
			// 绑定 service
			ctx.service(service.order.goods).done();
			app.refresh();
		}
		// 同意退款
		function rowPass(id: number) {
			service.order.goods.agreeRefund({ id }).then(() => {
				ElMessage.success("退款成功");
				refs.value.crud.refresh();
			});
		}
		// 拒绝退款
		function rowReject(id: number) {
			service.order.goods.rejectRefund({ id }).then(() => {
				ElMessage.success("拒绝成功");
			});
		}

		function onDateChange(date: any) {
			let [startTime, endTime] = date || [];

			if (startTime) {
				startTime = dayjs(startTime).format("YYYY-MM-DD 00:00:00");
			}

			if (endTime) {
				endTime = dayjs(endTime).format("YYYY-MM-DD 23:59:59");
			}

			refs.value.crud.refresh({ startTime, endTime });
		}
		return {
			selects,
			onDateChange,
			rowPass,
			rowReject,
			refs,
			setRefs,
			upsert,
			table,
			onLoad
		};
	}
});
</script>
