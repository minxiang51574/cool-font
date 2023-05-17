<template>
	<div class="page-order">
		<div class="count">
			<el-row :gutter="15">
				<el-col :lg="3" :md="12" :xs="24">
					<div class="card" @click="jumpCount(1)">
						<img
							style="width: 48px; height: 48px; border-radius: 50%"
							src="../static/images/1.png"
						/>
						<div class="content">
							<span class="order-num">{{ order.count }}</span>
							<span class="order-name">已付订单数量</span>
						</div>
					</div>
					<!--  -->
				</el-col>
				<el-col :lg="3" :md="12" :xs="24">
					<div class="card" @click="jumpCount(1)">
						<img
							style="width: 48px; height: 48px; border-radius: 50%"
							src="../static/images/2.png"
						/>
						<div class="content">
							<span class="order-num">{{ order.total }}</span>
							<span class="order-name">已付订单金额</span>
						</div>
					</div>
				</el-col>
				<el-col :lg="3" :md="12" :xs="24">
					<div class="card" @click="jump(1)">
						<img
							style="width: 48px; height: 48px; border-radius: 50%"
							src="../static/images/3.png"
						/>
						<div class="content">
							<span class="order-num">{{ order.undelivered }}</span>
							<span class="order-name">待发货</span>
						</div>
					</div>
					<!--  -->
				</el-col>
				<el-col :lg="3" :md="12" :xs="24">
					<div class="card" @click="jump(2)">
						<img
							style="width: 48px; height: 48px; border-radius: 50%"
							src="../static/images/4.png"
						/>
						<div class="content">
							<span class="order-num">{{ order.toBeReceived }}</span>
							<span class="order-name">待收货</span>
						</div>
					</div>
				</el-col>
				<el-col :lg="3" :md="12" :xs="24">
					<div class="card" @click="toBeProcessed()">
						<img
							style="width: 48px; height: 48px; border-radius: 50%"
							src="../static/images/8.png"
						/>
						<div class="content">
							<span class="order-num">{{ order.toBeProcessed }}</span>
							<span class="order-name">待退款</span>
						</div>
					</div>
				</el-col>
				<el-col :lg="3" :md="12" :xs="24">
					<div class="card" @click="jump(3)">
						<img
							style="width: 48px; height: 48px; border-radius: 50%"
							src="../static/images/7.png"
						/>
						<div class="content">
							<span class="order-num">{{ order.toBeEvaluated }}</span>
							<span class="order-name">待评价</span>
						</div>
					</div>
				</el-col>
				<el-col :lg="3" :md="12" :xs="24">
					<div class="card" @click="jumpCount(2)">
						<img
							style="width: 48px; height: 48px; border-radius: 50%"
							src="../static/images/6.png"
						/>
						<div class="content">
							<span class="order-num">{{ order.dayCount }}</span>
							<span class="order-name">今日订单数量</span>
						</div>
					</div>
				</el-col>
				<el-col :lg="3" :md="12" :xs="24">
					<div class="card" @click="jumpCount(2)">
						<img
							style="width: 48px; height: 48px; border-radius: 50%"
							src="../static/images/5.png"
						/>
						<div class="content">
							<span class="order-num">{{ order.dayTotal }}</span>
							<span class="order-name">今日支付金额</span>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>

		<div class="crud">
			<cl-crud :ref="setRefs('crud')" @load="onLoad">
				<el-row type="flex" align="middle">
					<!-- 刷新按钮 -->
					<cl-refresh-btn />

					<!-- 导出 -->
					<cl-export-btn type="success" :columns="table.columns" />
					<cl-query
						field="status"
						:list="[
							{ label: '全部', value: null },
							{ label: '待付款', value: 0 },
							{ label: '待发货', value: 1 },
							{ label: '待收货', value: 2 },
							{ label: '待评价', value: 3 },
							{ label: '交易完成', value: 4 },
							{ label: '已关闭', value: 5 }
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
						<!-- 商品数量 -->
						<!-- <template #column-gn="{ scope }">
							<span>{{ scope.row.goodsList.length }}</span>
						</template> -->

						<!-- 操作按钮 -->
						<template #slot-op-button="{ scope }">
							<el-button type="text" size="mini" @click="expandDetail(scope.row)"
								>详情</el-button
							>

							<template v-if="scope.row.status == 1">
								<el-button type="text" size="mini" @click="editLogistics(scope.row)"
									>发货</el-button
								>
							</template>

							<template v-else-if="scope.row.status == 2">
								<el-button type="text" size="mini" @click="editLogistics(scope.row)"
									>编辑</el-button
								>
								<el-button
									type="text"
									size="mini"
									@click="openLogistics(scope.row.id)"
									>查看物流</el-button
								>
							</template>
						</template>

						<!-- 商品详情 -->
						<template #column-detail="{ scope }">
							<div class="order-detail">
								<!-- 商品信息 -->
								<div class="order-detail__goods">
									<el-divider content-position="left"
										>商品列表（{{ scope.row.goodsList?.length }}）</el-divider
									>

									<el-row :gutter="20">
										<el-col
											v-for="item in scope.row.goodsList"
											:key="item.id"
											:span="8"
										>
											<goods-info show-refund :value="item" />

											<p class="remark" v-if="item.remark">
												备注：{{ item.remark }}
											</p>
										</el-col>
									</el-row>
								</div>

								<!-- 物流信息 -->
								<div class="order-detail__logistics">
									<el-divider content-position="left">物流信息</el-divider>

									<ul>
										<li>
											<p>
												<span>快递名称：</span>
												<span>{{ scope.row.logisticsName || "无" }}</span>
											</p>
											<p>
												<span>快递单号：</span>
												<span>{{
													scope.row.logisticsOrderNum || "无"
												}}</span>
											</p>
											<p>
												<span>收货地址：</span>
												<span>
													{{ scope.row.province }}-{{ scope.row.city }}-
													{{ scope.row.country }} {{ scope.row.detail }}
													{{ scope.row.contact }} {{ scope.row.phone }}
												</span>
											</p>
										</li>
									</ul>
								</div>
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

				<!-- 表单 -->
				<cl-form :ref="setRefs('form')" />

				<!-- 物流信息 -->
				<cl-dialog v-model="logistics.visible" title="物流信息">
					<el-timeline>
						<el-timeline-item
							v-for="(item, index) in logistics.list"
							:key="index"
							:timestamp="item.timestamp"
						>
							<p>{{ item.time }}</p>
							<p>{{ item.status }}</p>
						</el-timeline-item>
					</el-timeline>
				</cl-dialog>
			</cl-crud>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
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
		const { refs, setRefs, service, router } = useCool();

		const selects = reactive<any>({
			date: []
		});

		// 新增、编辑配置
		const upsert = reactive<Upsert>({
			items: []
		});

		// 表格配置
		const table = reactive<Table>({
			"context-menu": ["refresh"],
			columns: [
				{
					type: "selection",
					width: 60
				},
				{
					type: "expand",
					prop: "detail",
					label: "#"
				},
				{
					label: "订单号",
					prop: "orderNum",
					minWidth: 200
				},
				{
					label: "用户名称",
					prop: "contact",
					minWidth: 120
				},
				{
					label: "商品数量",
					prop: "gn",
					minWidth: 100
				},
				{
					label: "支付金额",
					prop: "price",
					sortable: "custom",
					minWidth: 150
				},
				{
					label: "支付方式",
					prop: "payType",
					minWidth: 120,
					dict: [
						{
							label: "微信",
							value: 0,
							type: "primary"
						},
						{
							label: "支付宝",
							value: 1,
							type: "success"
						},
						{
							label: "0元购",
							value: -1,
							type: "danger"
						}
					]
				},
				{
					label: "订单状态",
					prop: "status",
					minWidth: 120,
					dict: [
						{
							label: "待付款",
							value: 0,
							type: "primary"
						},
						{
							label: "待发货",
							value: 1,
							type: "success"
						},
						{
							label: "待收货",
							value: 2,
							type: "warning"
						},
						{
							label: "待评价",
							value: 3,
							type: "info"
						},
						{
							label: "交易完成",
							value: 4,
							type: "warning"
						},
						{
							label: "已关闭",
							value: 5,
							type: "danger"
						}
					]
				},
				{
					label: "创建时间",
					prop: "createTime",
					sortable: "custom",
					minWidth: 150
				},
				{
					label: "操作",
					type: "op",
					buttons: ["slot-op-button"]
				}
			]
		});

		// crud 加载
		function onLoad({ ctx, app }: CrudLoad) {
			// 绑定 service
			ctx.service(service.order.info).done();
			app.refresh();
		}

		//发货
		function editLogistics(row: any) {
			refs.value.form.open({
				items: [
					{
						prop: "logisticsOrderNum",
						label: "快递单号",
						value: row.logisticsOrderNum,
						component: {
							name: "el-input",
							props: {
								placeholder: "请输入单号",
								maxlength: 18
							}
						},
						rules: {
							required: true,
							message: "单号不能为空"
						}
					},
					{
						prop: "logisticsName",
						label: "快递名称",
						value: row.logisticsName,
						component: {
							name: "el-input",
							props: {
								placeholder: "请输入名称"
							}
						}
					}
				],
				on: {
					submit: (data: any, { close, done }: any) => {
						service.order.info
							.deliver({
								orderId: row.id,
								logisticsName: data.logisticsName,
								logisticsOrderNum: data.logisticsOrderNum,
								status: 2
							})
							.then(() => {
								ElMessage.success("发货成功");
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

		// 详情
		function expandDetail(row: any) {
			refs.value.table.toggleRowExpansion(row);
		}

		// 物流信息
		const logistics = reactive<any>({
			visible: false,
			list: []
		});

		// 打开物流
		function openLogistics(id: number) {
			service.order.info.logistics({ orderId: id }).then((res: any) => {
				logistics.visible = true;
				logistics.list = res.logistics.list;
			});
		}

		// 时间筛选
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
		const order = ref<any>({});
		onMounted(() => {
			service.order.info.orderAll().then((res: any) => {
				order.value = res;
			});
		});

		// 点击筛选条件
		function jump(num: number) {
			refs.value.crud.refresh({ status: num });
		}

		function toBeProcessed() {
			router.push({
				path: "/order/refund",
				query: {}
			});
		}
		function jumpCount(type: number) {
			if (type == 1) {
				refs.value.crud.refresh({ status: [1, 2, 3, 4] });
			} else if (type == 2) {
				refs.value.crud.refresh({ status: [1, 2, 3, 4], date: true });
			}
		}

		return {
			jumpCount,
			toBeProcessed,
			jump,
			order,
			selects,
			onDateChange,
			refs,
			setRefs,
			upsert,
			table,
			onLoad,
			logistics,
			openLogistics,
			expandDetail,
			editLogistics
		};
	}
});
</script>

<style lang="scss" scoped>
.order-detail {
	&__goods {
		.remark {
			margin-top: 10px;
			font-size: 12px;
		}
	}
}

.count {
	margin-bottom: 10px;

	.card {
		display: flex;
		align-items: center;
		height: 70px;
		border-radius: 5px;
		font-size: 12px;
		letter-spacing: 0.5px;
		box-sizing: border-box;
		background-color: #fff;
		padding-left: 20px;
		box-sizing: border-box;
		cursor: pointer;
		&.card:hover {
			background-color: rgba(0, 0, 0, 0.1);
		}
		img {
			margin-right: 15px;
		}

		.content {
			display: flex;
			flex-direction: column;
			justify-content: center;

			.order-num {
				display: block;
				margin-bottom: 4px;
				font-size: 20px;
				color: $color-primary;
			}

			.order-name {
				display: block;
				color: #999;
			}
		}
	}
}

.crud {
	height: calc(100% - 80px);
}
</style>
