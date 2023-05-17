<template>
	<div class="wechat-menu">
		<el-row type="flex">
			<!-- 菜单 -->
			<el-col :span="10">
				<div class="wechat-menu__left">
					<div class="page" v-loading="loading">
						<img class="page-bg" src="../static/images/mp-bg.png" />

						<div class="page-menu">
							<!-- 一级菜单 -->
							<ul class="page-menu__one">
								<li v-for="(item, index) in menu.button" :key="index">
									<div
										class="page-menu__one-item"
										:class="{
											'is-active': form ? item.id == form.id : false
										}"
										@contextmenu.stop.prevent="openCM($event, item)"
										@click="menuEdit(item)"
									>
										{{ item.name }}
									</div>

									<!-- 二级菜单 -->
									<ul class="page-menu__two" v-if="!item.type">
										<!-- 新增按钮 -->
										<li
											v-if="item.sub_button.length < 5"
											class="page-menu__two-item"
											@click="menuAdd2(item)"
										>
											<i class="el-icon-plus"></i>
										</li>

										<li
											v-for="(item2, index2) in item.sub_button"
											:key="index2"
											class="page-menu__two-item"
											:class="{
												'is-active': form ? item2.id == form.id : false
											}"
											@contextmenu.stop.prevent="openCM($event, item2)"
											@click.stop="menuEdit(item2, true)"
										>
											{{ item2.name }}
										</li>
									</ul>
								</li>

								<!-- 新增按钮 -->
								<li
									v-if="menu.button.length < 3"
									class="page-menu__one-item"
									@click="menuAdd"
								>
									<i class="el-icon-plus"></i>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</el-col>

			<!-- 表单 -->
			<el-col :span="14">
				<div class="wechat-menu__right">
					<div class="container" v-if="form">
						<el-form
							:ref="setRefs('form')"
							:model="form"
							:rules="rules"
							size="small"
							label-position="top"
						>
							<el-form-item prop="name" label="菜单名称">
								<el-input v-model="form.name" placeholder="请填写菜单名称" />
							</el-form-item>

							<el-form-item prop="type" label="规则状态">
								<el-select v-model="form.type" placeholder="请选择规则状态">
									<el-option v-if="!form.second" label="菜单" value="" />
									<el-option label="关键字" value="click" />
									<el-option label="跳转网页" value="view" />
									<el-option label="小程序" value="miniprogram" />
								</el-select>
							</el-form-item>

							<!-- 关键字 -->
							<template v-if="form.type === 'click'">
								<el-form-item prop="key" label="关键字">
									<el-input v-model="form.key" placeholder="请填写关键字" />
								</el-form-item>
							</template>

							<!-- 网页 -->
							<template v-if="form.type === 'view'">
								<el-form-item prop="url" label="跳转网页">
									<el-input v-model="form.url" placeholder="请填写跳转网页" />
								</el-form-item>
							</template>

							<!-- 小程序 -->
							<template v-if="form.type === 'miniprogram'">
								<el-form-item prop="appid" label="小程序appid">
									<el-input
										v-model="form.appid"
										placeholder="请填写小程序appid"
									/>
								</el-form-item>

								<el-form-item prop="pagepath" label="小程序路径">
									<el-input
										v-model="form.pagepath"
										placeholder="请填写小程序路径，如：pages/index/home"
									/>
								</el-form-item>

								<el-form-item prop="url" label="小程序备用路径">
									<el-input
										v-model="form.url"
										placeholder="请填写小程序备用路径，如：https://mall.cool-js.com/"
									/>
								</el-form-item>
							</template>
						</el-form>
					</div>

					<div class="footer">
						<el-button
							size="mini"
							round
							type="success"
							:loading="saving"
							:disabled="!isSave"
							@click="save"
							>保存修改</el-button
						>
						<template v-if="form">
							<el-button size="mini" round type="danger" @click="remove()"
								>删除当前菜单</el-button
							>
						</template>
						<el-button size="mini" type="primary" round @click="refresh"
							>还原</el-button
						>
						<el-button size="mini" round @click="clear">清空菜单</el-button>
					</div>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script lang="ts">
import { ContextMenu } from "cl-admin-crud-vue3";
import { ElMessage, ElMessageBox } from "element-plus";
import { defineComponent, reactive, ref, nextTick, computed, onMounted } from "vue";
import { useCool } from "/@/core";

let id = 0;

export default defineComponent({
	setup() {
		const { refs, setRefs, service } = useCool();

		// 菜单
		const menu = reactive<any>({
			button: []
		});

		// 验证规则
		const rules = reactive<any>({
			name: {
				required: true,
				message: "菜单名称不能为空"
			},
			key: {
				required: true,
				message: "关键字不能为空"
			},
			appid: {
				required: true,
				message: "小程序id不能为空"
			},
			pagepath: {
				required: true,
				message: "小程序路径不能为空"
			},
			url: [
				{
					required: true,
					message: "跳转网页不能为空"
				},
				{
					validator(_: any, value: string, callback: Function) {
						if (
							/^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/.test(
								value
							)
						) {
							callback();
						} else {
							callback(new Error("URL格式不正确"));
						}
					}
				}
			]
		});

		// 编辑表单
		const form = ref<any>(null);

		// 保存状态
		const saving = ref<boolean>(false);

		// 加载状态
		const loading = ref<boolean>(false);

		// 是否能保存
		const isSave = computed(() => menu.button.length > 0);

		// 获取配置
		async function refresh() {
			loading.value = true;

			await service.conf.weChat
				.findMpMenu()
				.then((res: any) => {
					if (res) {
						// 设置默认id
						function deep(list: any[]) {
							list.map((e: any) => {
								if (!e.id) {
									e.id = id++;
								}

								if (e.sub_button) {
									deep(e.sub_button);
								}
							});
						}
						deep(res.button);

						// 赋值
						for (const i in res) {
							menu[i] = res[i];
						}
					}
				})
				.catch((err: string) => {
					ElMessage.error(err);
				});

			loading.value = false;
		}

		// 保存数据
		function save() {
			async function next() {
				// 检测子菜单
				const subMenu = menu.button.find((e: any) => !e.type && e.sub_button.length == 0);

				if (subMenu) {
					return ElMessage.error(`${subMenu.name}必须添加子菜单`);
				}

				saving.value = true;

				await service.conf.weChat
					.createMpMenu({
						button: menu
					})
					.then(() => {
						ElMessage.success("保存成功");
					})
					.catch((err: string) => {
						ElMessage.error(err);
					});

				saving.value = false;
			}

			if (refs.value.form) {
				refs.value.form.validate((valid: boolean) => {
					if (valid) {
						next();
					}
				});
			} else {
				next();
			}
		}

		// 删除菜单
		function remove(data: any) {
			const item = data || form.value;

			ElMessageBox.confirm(`此操作将删除该${item.name}, 是否继续?`, "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			})
				.then(() => {
					// 判断是清空一级菜单还是二级
					menu.button.forEach((e: any, i: number) => {
						if (e.id == item.id) {
							menu.button.splice(i, 1);
						} else {
							if (e.sub_button) {
								e.sub_button.forEach((s: any, j: number) => {
									if (s.id == item.id) {
										e.sub_button.splice(j, 1);
									}
								});
							}
						}
					});

					// 清空表单
					if (form.value && item.id == form.value.id) {
						form.value = null;
					}

					ElMessage.success("删除成功，请保存！");
				})
				.catch(() => null);
		}

		// 清空菜单
		function clear() {
			ElMessageBox.confirm(`此操作将清空所有菜单, 是否继续?`, "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			})
				.then(async () => {
					await service.conf.weChat.clearMpMenu();
					menu.button = [];
					form.value = null;
					ElMessage.success("清空成功");
				})
				.catch(() => null);
		}

		// 编辑
		function menuEdit(item: any, flag?: boolean) {
			if (flag) {
				item.second = true;
			}

			item.id = id++;
			form.value = item;

			nextTick(() => {
				refs.value.form.clearValidate();
			});
		}

		// 新增一级菜单
		function menuAdd() {
			menuEdit({
				type: "",
				name: "一级菜单",
				sub_button: []
			});

			menu.button.push(form.value);
		}

		// 新增二级菜单
		function menuAdd2(item: any) {
			menuEdit({
				type: "click",
				name: "二级菜单",
				second: true
			});

			item.sub_button.push(form.value);
		}

		// 菜单右键
		function openCM(e: any, data: any) {
			ContextMenu.open(e, {
				list: [
					{
						label: "编辑",
						icon: "el-icon-edit",
						callback: (_: any, done: Function) => {
							done();
							menuEdit(data);
						}
					},
					{
						label: "删除",
						icon: "el-icon-delete",
						callback: (_: any, done: Function) => {
							remove(data);
							done();
						}
					}
				]
			});
		}

		onMounted(() => {
			refresh();
		});

		return {
			refs,
			setRefs,
			isSave,
			menu,
			rules,
			form,
			saving,
			loading,
			refresh,
			openCM,
			menuAdd,
			menuAdd2,
			menuEdit,
			save,
			remove,
			clear
		};
	}
});
</script>

<style lang="scss" scoped>
.wechat-menu {
	background-color: #fff;
	overflow: hidden auto;

	&__left {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 20px;

		.page {
			height: calc(812px / 1.1);
			width: calc(375px / 1.1);
			position: relative;
			border: 1px solid #eee;

			&-bg {
				height: 100%;
				width: 100%;
			}

			&-menu {
				position: absolute;
				bottom: 30px;
				left: 40px;
				height: 50px;
				width: calc(100% - 42px);

				li {
					font-size: 14px;
					list-style: none;
					cursor: pointer;
					position: relative;
				}

				&__one {
					display: flex;
					align-items: center;
					height: 100%;

					& > li {
						flex: 1;

						&:last-child {
							.page-menu__one-item {
								border-right: 0;
							}
						}
					}

					&-item {
						display: flex;
						align-items: center;
						justify-content: center;
						border-right: 1px solid #eee;

						&:hover,
						&.is-active {
							color: #67c23a;
						}
					}
				}

				&__two {
					display: flex;
					flex-direction: column;
					width: calc(100% - 6px);
					position: absolute;
					left: 3px;
					bottom: 50px;
					background-color: #fff;
					box-sizing: border-box;
					padding: 5px 10px;
					border-radius: 5px;

					&::after {
						border: 10px solid transparent;
						border-top: 10px solid #fff;
						width: 0;
						height: 0;
						position: absolute;
						content: " ";
						position: absolute;
						left: calc(50% - 10px);
						bottom: -20px;
					}

					&-item {
						display: flex;
						align-items: center;
						justify-content: center;
						height: 40px;
						border-bottom: 1px solid #eee;

						&:hover,
						&.is-active {
							color: #67c23a;
						}

						&:last-child {
							border-bottom: 0;
						}
					}
				}
			}
		}
	}

	&__right {
		padding: 20px;

		.container {
			border-bottom: 1px dashed #eee;
		}

		.footer {
			display: flex;
			align-items: center;
			height: 60px;
		}
	}
}
</style>
