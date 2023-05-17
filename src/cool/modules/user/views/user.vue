<template>
	<cl-crud :ref="setRefs('crud')" :on-refresh="onRefresh" @load="onLoad">
		<el-row type="flex" align="middle">
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />
			<cl-query
				field="source"
				:list="[
					{ label: 'App', value: 0 },
					{ label: '公众号', value: 1 },
					{ label: '小程序', value: 2 },
					{ label: 'H5', value: 3 }
				]"
			/>
			<cl-flex1 />
			<!-- 关键字搜索 -->
			<cl-search-key />
		</el-row>

		<el-row>
			<!-- 数据表格 -->
			<cl-table :ref="setRefs('table')" v-bind="table">
				<template #column-headimgurl="{ scope }">
					<cl-avatar
						class="cover"
						:src="scope.row.headimgurl"
						:style="{ margin: 'auto' }"
					/>
				</template>

				<template #column-status="{ scope }">
					<el-switch
						v-model="scope.row._status"
						active-color=" #ff4949"
						inactive-color=" #13ce66"
						@change="onStarusChange($event, scope.row)"
					/>
				</template>

				<template #column-labels="{ scope }">
					<el-tag
						v-for="(item, index) in scope.row.labels"
						:key="index"
						size="mini"
						style="margin: 5px 5px 0 0"
						disable-transitions
					>
						{{ item }}</el-tag
					>
				</template>

				<template #slot-up-labels="{ scope }">
					<el-button type="text" size="mini" @click="updateLabels(scope.row)"
						>编辑标签</el-button
					>
				</template>
			</cl-table>
		</el-row>

		<el-row type="flex">
			<cl-flex1 />
			<!-- 分页控件 -->
			<cl-pagination />
		</el-row>
		<!-- 表单 -->
		<cl-form :ref="setRefs('form')" />
	</cl-crud>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { CrudLoad, Table, RefreshOp } from "cl-admin-crud-vue3/types";
import { useCool } from "/@/core";
import { ElMessage } from "element-plus";

export default defineComponent({
	setup() {
		const { refs, setRefs, service } = useCool();

		// 表格配置
		const table = reactive<Table>({
			"context-menu": ["refresh", "delete"],
			columns: [
				{
					type: "selection",
					width: 60
				},
				{
					label: "昵称",
					prop: "nickname",
					align: "center",
					minWidth: 150
				},
				{
					label: "头像",
					prop: "headimgurl",
					align: "center",
					minWidth: 100
				},
				{
					label: "手机",
					prop: "phone",
					align: "center",
					minWidth: 120
				},
				{
					label: "标签",
					prop: "labels",
					align: "center",
					minWidth: 120
				},
				{
					label: "性别",
					prop: "sex",
					align: "center",
					dict: [
						{
							label: "未知",
							value: 0
						},
						{
							label: "男",
							value: 1
						},
						{
							label: "女",
							value: 2
						}
					],
					minWidth: 100
				},
				{
					label: "状态",
					prop: "status",
					align: "center",
					minWidth: 100,
					dict: [
						{
							label: "启用",
							value: 1,
							type: "success"
						},
						{
							label: "禁用",
							value: 0,
							type: "danger"
						}
					]
				},
				{
					label: "来源",
					prop: "source",
					dict: [
						{
							label: "App",
							value: 0,
							type: "danger"
						},
						{
							label: "公众号",
							value: 1,
							type: "success"
						},
						{
							label: "小程序",
							value: 2,
							type: "primary"
						},
						{
							label: "H5",
							value: 3,
							type: "warning"
						}
					]
				},
				{
					label: "创建时间",
					prop: "createTime",
					align: "center",
					sortable: "custom",
					minWidth: 150
				},
				{
					label: "更新时间",
					prop: "updateTime",
					align: "center",
					minWidth: 150
				},
				{
					label: "操作",
					type: "op",
					buttons: ["slot-up-labels", "delete"]
				}
			]
		});
		// 刷新钩子
		async function onRefresh(params: any, { next, render }: RefreshOp) {
			const { list } = await next(params);

			render(
				list.map((e: any) => {
					e._status = e.status == 0 ? true : false;
					e.labels = (e.labels || "").split(",").filter(Boolean);
					return e;
				})
			);
		}

		// 开启、关闭
		function onStarusChange(val: boolean, item: any) {
			if (val) {
				item.status = 0;
			} else {
				item.status = 1;
			}
			service.user.info
				.update({ id: item.id, status: item.status })
				.then(() => {
					ElMessage.success(val ? "禁用成功" : "启用成功");
				})
				.catch((err: string) => {
					ElMessage.error(err);
				});
		}
		// crud 加载
		function onLoad({ ctx, app }: CrudLoad) {
			ctx.service(service.user.info).done();
			app.refresh();
		}

		function updateLabels(row: any) {
			refs.value.form.open({
				items: [
					{
						prop: "lables",
						label: "标签",
						value: row.lables,
						hook: {
							bind: ["split"],
							submit: ["join"]
						},
						component: {
							name: "el-select",
							props: {
								multiple: true,
								filterable: true,
								allowCreate: true
							},
							options: [
								{
									value: "优质用户",
									label: "优质用户"
								},
								{
									value: "普通用户",
									label: "普通用户"
								},
								{
									value: "劣质用户",
									label: "劣质用户"
								}
							]
						}
					}
				],
				on: {
					submit: (data: any, { close, done }: any) => {
						console.log(row);
						console.log(data.lables);
						service.user.info
							.update({
								id: row.id,
								labels: data.lables
							})
							.then(() => {
								ElMessage.success("编辑成功");
								refs.value.crud.refresh();
								close();
							})
							.catch((err: any) => {
								ElMessage.error(err);
								done();
							});
					}
				}
			});
		}

		return {
			updateLabels,
			onStarusChange,
			onRefresh,
			refs,
			setRefs,
			table,
			onLoad
		};
	}
});
</script>
