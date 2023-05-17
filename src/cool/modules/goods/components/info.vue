<template>
	<div class="goods-info">
		<div class="goods-item" v-for="(item, index) in list" :key="index">
			<div class="goods-item__cover">
				<el-image :src="item.pic" :preview-src-list="[item.pic]" fit="cover" />
			</div>

			<div class="goods-item__det">
				<!-- 标题 -->
				<div class="goods-item__title">{{ item.title }}</div>

				<!-- 退款信息 -->
				<div class="goods-item__refund" v-if="showRefund">
					<el-tag size="mini" type="primary" v-if="item.status == 1" effect="dark"
						>退款中</el-tag
					>
					<el-tag size="mini" type="success" v-else-if="item.status == 2" effect="dark"
						>退款成功</el-tag
					>
					<el-tag size="mini" type="danger" v-else-if="item.status == 3" effect="dark"
						>退款失败</el-tag
					>
				</div>

				<div class="goods-item__footer">
					<el-row type="flex" align="middle">
						<!-- 价格 -->
						<span class="goods-item__price">{{ item.price || 0 }}</span>
						<!-- 数量 -->
						<span v-if="item.goodsCount" class="goods-item__number"
							>x {{ item.goodsCount }}</span
						>
						<!-- 优惠券信息 -->
						<el-tag
							v-if="item.discountPrice > 0"
							class="goods-item__coupon"
							size="mini"
							type="danger"
							effect="dark"
							>优惠：{{ item.discountPrice }}</el-tag
						>
					</el-row>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import _ from "lodash";

export default {
	props: {
		value: [Object, Array],
		showRefund: Boolean
	},

	computed: {
		list() {
			return _.isArray(this.value) ? this.value : [this.value];
		}
	}
};
</script>

<style lang="scss" scoped>
.goods-item {
	display: flex;
	cursor: pointer;
	position: relative;
	margin-bottom: 10px;

	&__cover {
		.el-image {
			height: 80px;
			width: 80px;
			background-color: #eee;
			border-radius: 3px;
		}
	}

	&__det {
		display: flex;
		flex-direction: column;
		flex: 1;
		margin-left: 10px;
	}

	&__title {
		font-size: 12px;
		max-height: 40px;
		line-height: 20px;
		text-align: left;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	&__footer {
		display: flex;
		align-items: flex-end;
		flex: 1;
	}

	&__price {
		font-size: 14px;

		&::before {
			content: "￥";
			font-size: 12px;
		}
	}

	&__number {
		margin-left: 5px;
	}

	&__coupon {
		margin-left: 10px;
	}

	&__refund {
		margin-top: 2px;
	}

	&:last-child {
		margin-bottom: 0;
	}
}
</style>
