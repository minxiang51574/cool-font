<template>
	<div
		class="conf-plugin"
		:style="{
			left: position.left,
			top: position.top
		}"
		:ref="setRefs('el')"
	>
		<div class="conf-plugin__header" :ref="setRefs('header')">
			<span>{{ label }}</span>

			<div class="icon" @click="visible = !visible">
				<i :class="`el-icon-${visible ? 'minus' : 'full-screen'}`"></i>
			</div>
		</div>

		<div class="conf-plugin__container scroller" :style="{ maxHeight }" v-show="visible">
			<slot></slot>
		</div>
	</div>
</template>

<script lang="ts">
import store from "store";
import { defineComponent, onMounted, reactive, ref } from "vue-demi";
import { useCool } from "/@/core";

export default defineComponent({
	name: "conf-plugin",

	cool: {
		global: true
	},

	props: {
		name: String,
		label: String,
		left: String,
		top: String,
		maxHeight: {
			type: String,
			default: "400px"
		}
	},

	setup(props) {
		const { refs, setRefs } = useCool();

		const key = `tools-${props.name}__position`;

		// 锁
		let lock: any = null;

		// 是否可见
		const visible = ref<boolean>(true);

		// 定位
		const position = reactive<any>({
			left: props.left || 0,
			top: props.top || 0
		});

		onMounted(() => {
			const box: any = document.querySelector(".container");

			refs.value.header.addEventListener("mousedown", (e: any) => {
				const { offsetLeft, offsetTop, clientHeight, clientWidth } = refs.value.el;

				lock = {
					x: e.clientX - offsetLeft,
					y: e.clientY - offsetTop,
					h: clientHeight,
					w: clientWidth
				};
			});

			window.addEventListener("mousemove", (e) => {
				if (lock) {
					const { x, y, h, w } = lock;

					let left = e.clientX - x;
					let top = e.clientY - y;

					if (left < 5) {
						left = 5;
					}

					if (top < 5) {
						top = 5;
					}

					if (top + h > box.clientHeight) {
						top = box.clientHeight - h - 5;
					}

					if (left + w > box.clientWidth) {
						left = box.clientWidth - w - 5;
					}

					position.left = left + "px";
					position.top = top + "px";
				}
			});

			window.addEventListener("mouseup", () => {
				store.set(key, position);
				lock = null;
			});
		});

		return {
			refs,
			setRefs,
			visible,
			position
		};
	}
});
</script>

<style lang="scss" scoped>
.conf-plugin {
	border-radius: 4px;
	margin-bottom: 10px;
	background-color: #fff;
	position: absolute;
	z-index: 999;
	min-width: 260px;
	padding: 2px;
	box-sizing: border-box;

	&__header {
		display: flex;
		align-items: center;
		font-size: 15px;
		padding: 0 10px;
		height: 40px;

		span {
			flex: 1;
			cursor: move;
		}

		.icon {
			cursor: pointer;
		}
	}

	&__container {
		overflow: hidden auto;
		min-height: 60px;
		padding: 10px 0;
	}
}
</style>
