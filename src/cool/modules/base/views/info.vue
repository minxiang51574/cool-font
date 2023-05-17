<template>
	<div class="page-my-info">
		<div class="title">基本信息</div>

		<el-form size="small" label-width="100px" :model="form" :disabled="saving">
			<el-form-item label="头像">
				<cl-upload v-model="form.headImg" />
			</el-form-item>

			<el-form-item label="昵称">
				<el-input v-model="form.nickName" placeholder="请填写昵称" />
			</el-form-item>

			<el-form-item label="密码">
				<el-input v-model="form.password" type="password" />
			</el-form-item>

			<el-form-item label="是否推送">
				<el-switch v-model="form.isPush" :active-value="1" :inactive-value="0" />
				<span style="padding: 20px"
					><span v-if="form.wxNickName != null && form.wxNickName != ''">{{
						form.wxNickName
					}}</span>
					<span v-else>未绑定微信号</span></span
				>

				<el-button type="text" :disabled="saving" @click="configOpenid">绑定微信</el-button>
			</el-form-item>

			<el-form-item label="">
				<el-button type="primary" :disabled="saving" @click="save">保存修改</el-button>
			</el-form-item>

			<cl-dialog v-model="visible" title="请扫码配置" width="250px" :controls="['close']">
				<img style="width: 200px; height: 200px" :src="conTent" />
			</cl-dialog>
		</el-form>
	</div>
</template>

<script lang="ts">
import { ElMessage } from "element-plus";
import { defineComponent, reactive, ref, inject } from "vue";
import { useCool } from "/@/core";

export default defineComponent({
	name: "sys-info",

	cool: {
		route: {
			path: "/my/info",
			meta: {
				label: "个人中心"
			}
		}
	},

	setup() {
		const mitt = inject<any>("mitt");
		const { store, service } = useCool();

		// 表单数据
		const form = reactive<any>(store.getters.userInfo);

		// 保存状态
		const saving = ref<boolean>(false);

		// 保存
		async function save() {
			const { headImg, nickName, password, isPush } = form;

			saving.value = true;

			await service.base.common
				.userUpdate({
					headImg,
					nickName,
					password,
					isPush
				})
				.then(() => {
					form.password = "";
					ElMessage.success("修改成功");
					store.dispatch("userInfo");
				})
				.catch((err: string) => {
					ElMessage.error(err);
				});

			saving.value = false;
		}
		// 事件通知
		mitt.on("bind-wx", () => {
			console.log(111);
			ElMessage.success("绑定成功");
			store.dispatch("userInfo");
			visible.value = false;
		});

		const visible = ref<boolean>(false);
		const conTent = ref<string>("");
		/**
		 * 扫码配置微信
		 */
		function configOpenid() {
			service.base.system.wachat.qrcode().then((res: any) => {
				// 修改当前用户的场景值id
				service.base.system.user.updateScene({
					id: store.getters.userInfo.id,
					sceneId: res.sceneId
				});
				conTent.value = res.url;
				visible.value = true;
			});
		}

		return {
			visible,
			conTent,
			configOpenid,
			form,
			saving,
			save
		};
	}
});
</script>

<style lang="scss">
.page-my-info {
	background-color: #fff;
	height: 100%;
	padding: 20px;
	box-sizing: border-box;

	.el-form {
		width: 400px;
		max-width: 100%;
	}

	.title {
		color: #000;
		margin-bottom: 30px;
		font-size: 15px;
	}
}
</style>
