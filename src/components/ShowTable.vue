<template>
	<div class="show-table-container">
		<el-table
			:data="dataList"
			style="width: 100%"
			height="830"
			:default-sort="{ prop: 'periods', order: 'ascending' }"
			border
			show-summary
			:summary-method="handleSummaries"
			:row-class-name="tableRowClassName"
		>
			<el-table-column
				fixed
				sortable
				prop="periods"
				label="期数"
				align="center"
			/>
			<el-table-column
				prop="first"
				label="千位"
				align="center"
			/>
			<el-table-column
				prop="second"
				label="百位"
				align="center"
			/>
			<el-table-column
				prop="third"
				label="十位"
				align="center"
			/>
			<el-table-column
				prop="four"
				label="个位"
				align="center"
			/>
			<el-table-column
				label="总数"
				align="center"
			>
				<template #default="{ row }">
					<div :class="handleSumClassName(row)">{{ row.sum }}</div>
				</template>
			</el-table-column>
			<el-table-column
				prop="type"
				label="类型"
				align="center"
			/>
		</el-table>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import {
	HistoryData,
	DataType,
	SummaryMethodProps,
} from "@/interfaces/history-data";
import { h } from "vue";
import type { VNode } from "vue";

@Options({
	props: {
		dataList: [],
		doubleRange: [], // 双重总数范围
		singleRange: [], // 单重总数范围
	},
	methods: {
		tableRowClassName(row: any) {
			const data: HistoryData = row.row;

			// var className = '';
			// if (data.underline) {
			// 	className = 'add-underline';
			// }

			if (
				data.type === DataType.Single &&
				data.sum >= this.singleRange[0] &&
				data.sum <= this.singleRange[1]
			) {
				return "single-row";
			}

			if (
				data.type === DataType.Double &&
				data.sum >= this.doubleRange[0] &&
				data.sum <= this.doubleRange[1]
			) {
				return "double-row";
			}
		},
		// 处理总计
		handleSummaries(param: SummaryMethodProps) {
			const { columns, data } = param;
			const sums: (string | VNode)[] = [];

			var singleSum = 0,
				doubleSum = 0,
				otherSum = 0; // 总数
			data.forEach((d) => {
				if (d.type === DataType.Single) {
					singleSum += 1;
				} else if (d.type === DataType.Double) {
					doubleSum += 1;
				} else if (d.type !== DataType.Empty) {
					otherSum += 1;
				}
			});
			// 单:52, 双:46, 其他:2
			console.log(
				"singleSum = ",
				singleSum,
				"doubleSum = ",
				doubleSum,
				"otherSum = ",
				otherSum
			);

			columns.forEach((column, index) => {
				if (index === 0) {
					sums[index] = h("div", { style: { textDecoration: "underline" } }, [
						"总计:",
					]);
				} else if (index === 1) {
					sums[index] = h("div", ["单重总数:"]);
				} else if (index === 2) {
					sums[index] = h("div", { style: { color: "red" } }, [singleSum]);
				} else if (index === 3) {
					sums[index] = h("div", ["双重总数:"]);
				} else if (index === 4) {
					sums[index] = h("div", { style: { color: "red" } }, [doubleSum]);
				} else if (index === 5) {
					sums[index] = h("div", ["其他总数:"]);
				} else if (index === 6) {
					sums[index] = h("div", { style: { color: "red" } }, [otherSum]);
				}
			});

			return sums;
		},
		// 处理总数单元格样式名称
		handleSumClassName(row: HistoryData) {
			if (
				row.type === DataType.Single &&
				row.sum >= this.singleRange[0] &&
				row.sum <= this.singleRange[1]
			) {
				return "text-important";
			}

			if (
				row.type === DataType.Double &&
				row.sum >= this.doubleRange[0] &&
				row.sum <= this.doubleRange[1]
			) {
				return "text-important";
			}

			return "";
		},
	},
})
export default class HelloWorld extends Vue {
	dataList!: Array<{ [key: string]: any }>;
	tableRowClassName!: Function;
	handleSummaries!: Function;
	handleSumClassName!: Function;
}
</script>

<style lang="scss" scoped>
:deep(.el-table .single-row) {
	--el-table-tr-bg-color: var(--el-color-success-light-9);
}

:deep(.el-table .double-row) {
	--el-table-tr-bg-color: var(--el-color-warning-light-9);
}

:deep(.el-table .el-table__cell .text-important) {
	color: red;
}
</style>
