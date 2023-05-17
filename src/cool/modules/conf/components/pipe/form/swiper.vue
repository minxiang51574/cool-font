<template>
	<div class="conf-form-swiper">
		<div class="conf-form-swiper__item" v-for="(item, index) in list" :key="index">
			<cl-upload :size="[150, 275]" v-model="item.url" />
			<el-input placeholder="请填写跳转地址" v-model="item.link" />

			<i class="el-icon-close" @click="remove(index)"></i>
		</div>

		<div class="conf-form-swiper__item is-add" @click="add">
			<i class="el-icon-plus"></i>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
	name: "conf-form-swiper",

	cool: {
		global: true
	},

	props: {
		modelValue: {
			type: Array,
			default: () => []
		}
	},

	setup(props) {
		const list = computed<any[]>(() => props.modelValue);

		function add() {
			list.value.push({
				url: "",
				link: ""
			});
		}

		function remove(index: number) {
			list.value.splice(index, 1);
		}

		return {
			list,
			add,
			remove
		};
	}
});
</script>

<style lang="scss" scoped>
.conf-form-swiper {
	&__item {
		position: relative;
		margin-bottom: 20px;

		.el-input {
			margin-top: 10px;
		}

		.el-icon-close {
			position: absolute;
			right: 10px;
			top: 5px;
			z-index: 9;
			background-color: rgba(0, 0, 0, 0.3);
			padding: 2px 5px;
			color: #fff;
			border-radius: 3px;
			cursor: pointer;
			&:hover {
				background-color: rgba(red, 0.9);
			}
		}

		&.is-add {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 150px;
			width: 275px;
			border: 1px dashed #d9d9d9;
			border-radius: 6px;
			font-size: 24px;
			cursor: pointer;

			&:hover {
				border-color: $color-primary;
				color: $color-primary;
			}
		}
	}
}
</style>
