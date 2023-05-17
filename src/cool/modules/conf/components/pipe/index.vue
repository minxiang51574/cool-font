<template>
	<div class="conf-pipe" :class="[d.name]" :style="[d.style]" v-if="d">
		<template v-if="d.children">
			<conf-pipe :data="item" v-for="(item, index) in d.children" :key="index" />
		</template>

		<template v-else>
			<!-- 文本 -->
			<template v-if="d.name == 'text'">
				<span :style="[d.innerStyle]">{{ d.value }}</span>
			</template>

			<!-- 图片 -->
			<template v-else-if="d.name == 'image'">
				<img :src="d.value" :fit="d.props.mode" :style="[d.innerStyle]" />
			</template>

			<!-- 轮播图 -->
			<template v-else-if="d.name == 'cl-swiper'">
				<el-carousel :height="d.props.height">
					<el-carousel-item v-for="item in d.value" :key="item">
						<el-image fit="cover" :src="item.url" style="height: 100%; width: 100%" />
					</el-carousel-item>
				</el-carousel>
			</template>

			<!-- 块 -->
			<template v-else>
				<div :style="[d.innerStyle]">{{ d.value }}</div>
			</template>
		</template>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
	name: "conf-pipe",

	cool: {
		global: true
	},

	props: {
		data: Object
	},

	setup(props) {
		const d = computed(() => {
			const str: string = JSON.stringify(props.data);
			const d = JSON.parse(str.replace(/rpx/g, "px"));

			if (!d.props) {
				d.props = {};
			}

			return d;
		});

		return {
			d
		};
	}
});
</script>

<style lang="scss" scoped>
.conf-pipe {
	img {
		max-width: 100%;
	}
}
</style>
