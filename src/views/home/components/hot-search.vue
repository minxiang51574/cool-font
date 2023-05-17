<template>
	<div class="hot-search">
		<div class="hot-search__header">
			<span>线上热门搜索</span>
		</div>

		<div class="hot-search__container">
			<div class="hot-search__table">
				<cl-crud @load="onLoad">
					<el-row>
						<cl-table
							:auto-height="false"
							:props="{
								border: false,
								'default-sort': {
									prop: 'ud',
									order: 'descending'
								}
							}"
							:context-menu="false"
							:columns="[
								{
									label: '排名',
									prop: 'index',
									width: 60
								},
								{
									label: '搜索关键词',
									prop: 'keyWord',
									'min-width': 100
								},
								{
									label: '搜索数',
									prop: 'users',
									'min-width': 100
								}
							]"
						/>
					</el-row>
				</cl-crud>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";

export default defineComponent({
	setup() {
		const service = inject<any>("service");

		function onLoad({ ctx, app }: any) {
			ctx.service({
				page() {
					return service.seach
						.seachAll({
							page: 1,
							size: 10
						})
						.then((res: any) => {
							let i = 0;
							return {
								list: res.map((e: any) => {
									i++;
									return {
										index: i,
										keyWord: e.content,
										users: e.count
									};
								})
							};
						});
				}
			}).done();
			app.refresh();
		}

		return { onLoad };
	}
});
</script>

<style lang="scss">
.hot-search {
	&__header {
		display: flex;
		align-items: center;
		height: 50px;
		font-size: 15px;
		font-weight: bold;
		padding: 0 20px;
	}

	&__chart {
		padding: 0 20px;

		.block {
			margin: 10px 0;

			.count {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 10px;
				height: 40px;

				.fall,
				.rise {
					display: flex;
					align-items: center;
					margin-left: 10px;
					font-size: 15px;
				}

				.fall {
					color: #13ae7c;
				}

				.rise {
					color: #f21e37;
				}

				.number {
					display: flex;
					align-items: center;

					span {
						font-size: 13px;

						&:last-child {
							margin-left: 10px;
							font-size: 15px;
							font-weight: bold;
						}
					}
				}
			}

			.echarts {
				height: 50px;
				width: 100%;
			}
		}
	}

	&__table {
		padding: 10px;

		.el-table {
			&__header {
				th {
					background-color: #fff !important;
				}
			}
		}
	}
}
</style>
