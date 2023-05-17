<template>
	<div class="activity-base-config">
		<div class="form">
			<cl-form v-model="form" :ref="setRefs('form')" inner>
				<!-- 继承插槽 -->
				<template #[item] v-for="item in slotsName">
					<slot :name="item"></slot>
				</template>
			</cl-form>
		</div>
	</div>
</template>

<script lang="ts">
import { ElMessage } from "element-plus";
import { defineComponent, onMounted, ref } from "vue";
import { useCool } from "/@/core";

export default defineComponent({
	name: "activity-base-config",

	props: {
		conf: {
			type: Object,
			default: () => {
				return {
					items: []
				};
			}
		}
	},

	setup(props, { slots }) {
		const { refs, setRefs, service, route } = useCool();

		// 继承插槽
		const slotsName = Object.keys(slots);

		// 表单
		const form = ref<any>({});

		onMounted(() => {
			const { id, type } = route.query;

			let d: any = {};

			// 活动详情
			service.market.activity.info
				.info({
					id,
					type
				})
				.then((res: any) => {
					d = res;
					form.value = res.conf || {};
				});

			// 打开表单
			refs.value.form.open({
				items: props.conf.items,
				on: {
					submit(data: any, { done }: any) {
						service.market.activity.info[d.conf ? "update" : "add"]({
							...d,
							conf: {
								...d.conf,
								...data
							}
						})
							.then(() => {
								ElMessage.success("保存成功");
								done();
							})
							.catch((err: string) => {
								ElMessage.error(err);
								done();
							});
					}
				}
			});
		});

		return {
			refs,
			setRefs,
			slotsName,
			form
		};
	}
});
</script>

<style lang="scss" scoped>
.activity-base-config {
	.form {
		width: 500px;
	}
}
</style>
