<template>
	<div class="coupon-">
		<cl-crud :ref="setRefs('crud')" @load="onLoad" :on-refresh="onRefresh">
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
					<!-- 商品信息 -->
					<template #column-limitedNum="{ scope }">
						<div v-if="scope.row.isLimited == 0">
							<span>不限量</span>
						</div>
						<div v-else>
							<p>发布：{{ scope.row.limitedNum }}</p>
							<p>剩余：{{ scope.row.limitedNum - scope.row.getNum }}</p>
						</div>
					</template>

					<!-- 是否开启 -->
					<template #column-open="{ scope }">
						<el-switch
							v-model="scope.row._open"
							active-color=" #ff4949"
							inactive-color=" #13ce66"
							@change="onOpenChange($event, scope.row)"
						/>
					</template>

					<!-- 是否开启 -->
					<template #column-time="{ scope }">
						<div v-if="scope.row.timeType == 0">
							<p>
								{{ scope.row.day }}
							</p>
						</div>
						<div v-else>
							<p>
								{{ scope.row.endTime }}
							</p>
							<p>
								{{ scope.row.startTime }}
							</p>
						</div>
					</template>

					<!-- 操作 -->
					<template #slot-op-operation="{ scope }">
						<el-button type="text" size="mini" @click="getRecord(scope.row.id)"
							>领取记录</el-button
						>
						<el-button
							v-if="scope.row.way == 2"
							type="text"
							size="mini"
							@click="sendCoupon(scope.row)"
							>发放优惠券</el-button
						>
					</template>
				</cl-table>
			</el-row>

			<el-row type="flex">
				<cl-flex1 />
				<!-- 分页控件 -->
				<cl-pagination />
			</el-row>

			<!-- 新增、编辑 -->
			<cl-upsert :ref="setRefs('upsert')" v-bind="upsert" :on-submit="onUpsertSubmit">
				<!-- 商品类目 -->
				<template #slot-category="{ scope }">
					<goods-category-select v-model="scope.insider" />
				</template>

				<!-- 商品列表 -->
				<template #slot-goods-insider="{ scope }">
					<div class="goods-list">
						<div class="item" v-for="(item, index) in scope.goodsList" :key="item.pic">
							<cl-image :src="item.pic" :size="60" />
							<i class="el-icon-close" @click="removeGoods(scope, index)"></i>
						</div>
					</div>

					<el-button @click="openGoods()" size="mini" type="success" round
						>选择商品</el-button
					>

					<!-- 商品选择 -->
					<goods-select
						:list="scope.goodsList"
						:ref="setRefs('goods-select')"
						multiple
						@select="onGoodsSelect"
					/>
				</template>
			</cl-upsert>

			<!-- 表单 -->
			<cl-form :ref="setRefs('form')">
				<!-- 用户选择 -->
				<template #slot-user-select="{ scope }">
					<el-select
						v-model="scope.userIds"
						filterable
						remote
						multiple
						reserve-keyword
						:remote-method="likeName"
						default-first-option
					>
						<el-option
							v-for="item in userList"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
				</template>
			</cl-form>
		</cl-crud>

		<!-- 领取记录 -->
		<cl-dialog
			v-model="record.visible"
			title="优惠券领取记录"
			width="600px"
			:controls="['close']"
		>
			<el-table size="mini" :data="record.list" style="width: 100%">
				<el-table-column prop="nickname" label="用户名称" align="center" />
				<el-table-column prop="headimgurl" label="用户头像" align="center">
					<template #default="scope">
						<cl-avatar :src="scope.row.headimgurl" style="margin: 0 auto" />
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="领取时间" align="center" />
				<el-table-column prop="status" label="优惠券状态" align="center" />
			</el-table>
		</cl-dialog>
	</div>
</template>

<script lang="ts">
import dayjs from "dayjs";
import { defineComponent, reactive, ref } from "vue";
import { CrudLoad, Upsert, Table, RefreshOp } from "cl-admin-crud-vue3/types";
import { useCool } from "/@/core";
import { ElMessage } from "element-plus";
import GoodsSelect from "/$/goods/components/select.vue";
import GoodsCategorySelect from "/$/goods/components/category/select.vue";

export default defineComponent({
	components: {
		GoodsSelect,
		GoodsCategorySelect
	},

	setup() {
		// 功能
		const { refs, setRefs, service } = useCool();

		// 新增、编辑配置
		const upsert = reactive<Upsert>({
			items: [
				{
					label: "名称",
					prop: "name",
					component: {
						name: "el-input",
						attrs: {
							placeholder: "请填写优惠券名称"
						}
					},
					rules: {
						required: true,
						message: "优惠券名称不能为空"
					}
				},
				{
					label: "发送方式",
					prop: "way",
					value: 0,
					component: {
						name: "el-radio-group",
						options: [
							{
								label: "手动领取",
								value: 0
							},
							{
								label: "新人券",
								value: 1
							},
							{
								label: "赠送券",
								value: 2
							},
							{
								label: "会员券",
								value: 3
							}
						]
					},
					rules: {
						required: true,
						message: "优惠券领取方式不能为空"
					}
				},
				{
					label: "优惠券类型",
					prop: "type",
					value: 0,
					component: {
						name: "el-radio-group",
						options: [
							{
								label: "通用券",
								value: 0
							},
							{
								label: "品类券",
								value: 1
							},
							{
								label: "商品券",
								value: 2
							}
						]
					},
					rules: {
						required: true,
						message: "优惠券类型不能为空"
					}
				},
				{
					label: "选择分类",
					prop: "insider",
					component: {
						name: "slot-category"
					},
					hidden: ({ scope }: any) => {
						return scope.type != 1;
					},
					rules: {
						required: true,
						message: "分类不能为空"
					}
				},
				{
					label: "选择商品",
					prop: "goodsList",
					value: [],
					component: {
						name: "slot-goods-insider"
					},
					hidden: ({ scope }: any) => {
						return scope.type != 2;
					},
					rules: {
						required: true,
						message: "商品不能为空"
					}
				},
				{
					label: "优惠券面值",
					prop: "couponsPrice",
					value: 1,
					component: {
						name: "cl-input-price"
					},
					rules: {
						required: true,
						message: "优惠券面值不能为空"
					}
				},
				{
					label: "使用门槛",
					prop: "threshold",
					value: 0,
					component: {
						name: "el-radio-group",
						options: [
							{
								label: "无门槛",
								value: 0
							},
							{
								label: "有门槛",
								value: 1
							}
						]
					},
					rules: {
						required: true
					}
				},
				{
					prop: "thresholdPrice",
					component: {
						name: "cl-input-price",
						props: {
							min: 0,
							max: 10000
						}
					},
					hidden: ({ scope }: any) => scope.threshold != 1,
					rules: {
						required: true,
						message: "门槛金额不能为空"
					}
				},
				{
					label: "使用时间",
					prop: "timeType",
					value: 0,
					component: {
						name: "el-radio-group",
						options: [
							{
								label: "天数",
								value: 0
							},
							{
								label: "时间段",
								value: 1
							}
						]
					},
					rules: {
						required: true
					}
				},
				{
					prop: "useDay",
					value: 30,
					component: {
						name: "el-input-number",
						props: {
							min: 0,
							max: 10000
						}
					},
					hidden: ({ scope }: any) => scope.timeType != 0,
					rules: {
						required: true,
						message: "使用时间不能为空"
					}
				},
				{
					prop: "useTime",
					hook: "datetimerange",
					component: {
						name: "el-date-picker",
						props: {
							type: "datetimerange"
						}
					},
					hidden: ({ scope }: any) => scope.timeType != 1,
					rules: {
						required: true,
						message: "使用时间不能为空"
					}
				},
				{
					label: "领取时间",
					prop: "getTime",
					value: 0,
					component: {
						name: "el-radio-group",
						options: [
							{
								label: "限时",
								value: 0
							},
							{
								label: "不限时",
								value: 1
							}
						]
					}
				},
				{
					prop: "_recTime",
					hook: {
						bind: (_: any, form: any) => {
							const { getStartTimeData, getEndTimeData } = form;
							return getStartTimeData ? [getStartTimeData, getEndTimeData] : [];
						},

						submit: (value: any, form: any) => {
							const [getStartTimeData, getEndTimeData] = value || [];

							form.getStartTimeData = getStartTimeData;
							form.getEndTimeData = getEndTimeData;
						}
					},
					value: [],
					component: {
						name: "el-date-picker",
						props: {
							type: "datetimerange"
						}
					},
					hidden: ({ scope }: any) => scope.getTime != 0,
					rules: {
						required: true,
						message: "领取时间不能为空"
					}
				},
				{
					label: "是否限量",
					prop: "isLimited",
					value: 0,
					component: {
						name: "el-radio-group",
						options: [
							{
								label: "限量",
								value: 1
							},
							{
								label: "不限量",
								value: 0
							}
						]
					}
				},
				{
					prop: "limitedNum",
					value: 100,
					component: {
						name: "el-input-number",
						props: {
							controlsPosition: "right",
							min: 0,
							max: 100000
						}
					},
					hidden: ({ scope }: any) => {
						return scope.isLimited != 1;
					},
					rules: {
						required: true,
						message: "限制数量不能为空"
					}
				},
				{
					label: "状态",
					prop: "open",
					value: 1,
					component: {
						name: "el-radio-group",
						options: [
							{
								label: "开启",
								value: 1
							},
							{
								label: "关闭",
								value: 0
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
					label: "名称",
					prop: "name",
					minWidth: 110
				},
				{
					label: "类型",
					prop: "type",
					minWidth: 100,
					dict: [
						{
							label: "通用券",
							value: 0,
							type: "danger"
						},
						{
							label: "品类券",
							value: 1,
							type: "success"
						},
						{
							label: "商品券",
							value: 2,
							type: "info"
						}
					]
				},
				{
					label: "金额",
					prop: "couponsPrice",
					minWidth: 100
				},
				{
					label: "领取方式",
					prop: "way",
					minWidth: 100,
					dict: [
						{
							label: "手动领取",
							value: 0,
							type: "danger"
						},
						{
							label: "新人券",
							value: 1,
							type: "success"
						},
						{
							label: "赠送券",
							value: 2,
							type: "success"
						},
						{
							label: "会员券",
							value: 3,
							type: "success"
						}
					]
				},
				{
					label: "有效期",
					prop: "time",
					minWidth: 120
				},
				{
					label: "发布数量",
					prop: "limitedNum",
					minWidth: 120
				},
				{
					label: "是否开启",
					prop: "open",
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
					label: "操作",
					type: "op",
					width: 240,
					buttons: ["slot-op-operation", "edit", "delete"]
				}
			]
		});

		// crud 加载
		function onLoad({ ctx, app }: CrudLoad) {
			// 绑定 service
			ctx.service(service.market.coupons.info).done();
			app.refresh();
		}

		// 刷新钩子
		async function onRefresh(params: any, { next, render }: RefreshOp) {
			const { list } = await next(params);

			render(
				list.map((e: any) => {
					e._open = e.open == 0 ? true : false;
					return e;
				})
			);
		}

		// 开启关闭
		function onOpenChange(val: boolean, item: any) {
			if (val) {
				item.open = 0;
			} else {
				item.open = 1;
			}
			service.market.coupons.info
				.update({ id: item.id, open: item.open })
				.then(() => {
					ElMessage.success(val ? "禁用成功" : "启用成功");
				})
				.catch((err: string) => {
					ElMessage.error(err);
				});
		}

		const record = reactive<any>({
			visible: false,
			list: []
		});

		// 领取记录
		function getRecord(id: number) {
			service.market.coupons.info.getRecord({ id: id }).then((res: any) => {
				record.visible = true;

				record.list = res.map((e: any) => {
					if (e.status == 0) {
						e.status = "不可用";
					} else if (e.status == 1) {
						e.status = "可用";
					} else if (e.status == 2) {
						e.status = "已使用";
					} else if (e.status == 3) {
						e.status = "已过期";
					}
					return e;
				});
			});
		}

		const userList = ref<any[]>([]);

		// 设置用户为搜索值
		function likeName(query: any) {
			service.user.info.page({ keyWord: query }).then((res: any) => {
				userList.value = res.list.map((e: any) => {
					return {
						label: e.id + " : " + e.nickname,
						value: e.id
					};
				});
			});
		}

		// 向用户发送优惠券
		function sendCoupon(row: any) {
			refs.value.form.open({
				items: [
					{
						prop: "name",
						label: "优惠券名称",
						value: row.name,
						component: {
							name: "el-input",
							props: {
								disabled: true
							}
						}
					},
					{
						prop: "userIds",
						label: "赠送用户",
						component: {
							name: "slot-user-select",
							props: {
								placeholder: "请选择用户"
							}
						}
					}
				],
				on: {
					submit: (data: any, { close, done }: any) => {
						service.market.coupons.info
							.sendIds({
								id: row.id,
								userIds: data.userIds
							})
							.then(() => {
								ElMessage.success("赠送成功");
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

		// 分类列表
		const categoryList = ref<any[]>([]);

		function categoryName(query: any) {
			service.goods.category.page({ keyWord: query }).then((res: any) => {
				categoryList.value = res.list.map((e: any) => {
					return {
						label: e.id + " : " + e.name,
						value: e.id
					};
				});
			});
		}

		// 商品选择
		function openGoods() {
			refs.value["goods-select"].open();
		}

		// 商品选择回掉
		function onGoodsSelect(...selection: any[]) {
			const list = refs.value.upsert.getForm("goodsList");

			// 去重
			selection.forEach((e: any) => {
				if (!list.find((a: any) => a.id == e.id)) {
					list.push(e);
				}
			});

			refs.value.upsert.setForm("goodsList", list);
		}

		// 移除商品
		function removeGoods(form: any, index: number) {
			form.goodsList.splice(index, 1);
		}

		// 提交事件
		function onUpsertSubmit(_: any, data: any, { next }: any) {
			let { type, timeType, startTime, endTime, useDay, insider, goodsList } = data;

			if (timeType == 0) {
				endTime = dayjs().add(useDay, "days");
				startTime = dayjs();
			}

			// 商品券
			if (type == 2) {
				insider = goodsList.map((e: any) => e.id).join(",");
			}

			next({
				...data,
				insider,
				startTime: startTime ? dayjs(startTime).format("YYYY-MM-DD 00:00:00") : null,
				endTime: endTime ? dayjs(endTime).format("YYYY-MM-DD 23:59:59") : null
			});
		}

		return {
			onUpsertSubmit,
			onGoodsSelect,
			openGoods,
			removeGoods,
			categoryName,
			categoryList,
			userList,
			likeName,
			sendCoupon,
			record,
			getRecord,
			onRefresh,
			onOpenChange,
			refs,
			setRefs,
			upsert,
			table,
			onLoad
		};
	}
});
</script>

<style lang="scss" scoped>
.goods-list {
	display: flex;
	flex-wrap: wrap;

	.item {
		margin: 0 10px 10px 0;
		position: relative;
		border: 1px solid #eee;

		.el-icon-close {
			background-color: red;
			color: #fff;
			position: absolute;
			right: -3px;
			top: -3px;
			cursor: pointer;
		}
	}
}
</style>
