<template>
	<div class="app-container">
		<el-tabs v-model="activeName">
			<el-tab-pane
				label="排列五"
				name="five"
			>
				<show-table
					:dataList="fiveDataList"
					:singleRange="[11, 26]"
					:doubleRange="[9, 29]"
				></show-table>
			</el-tab-pane>
			<el-tab-pane
				label="七星彩"
				name="seven"
			>
				<show-table
					:dataList="sevenDataList"
					:singleRange="[9, 28]"
					:doubleRange="[8, 28]"
				></show-table>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ShowTable from "@/components/ShowTable.vue";
import { HistoryData, DataType } from "@/interfaces/history-data";

@Options({
	data() {
		return {
			fiveDataList: [], // 排五数据
			sevenDataList: [], // 七星数据
			activeName: "five", // tab
		};
	},
	created() {
		this.fetchLottery5HistoryData(); // 5 数据
		this.fetchLottery7HistoryData(); // 7 数据
	},
	methods: {
		// 获取排五数据
		fetchLottery5HistoryData() {
			fetch(
				"https://webapi.sporttery.cn/gateway/lottery/getHistoryPageListV1.qry?gameNo=350133&provinceId=0&isVerify=1&termLimits=100"
			)
				.then((resp) => {
					if (resp.ok) {
						return resp.json();
					}
				})
				.then((data) => {
					const resultArray = this.handleRecombinationData(data.value.list);
					// 获取最后的期数
					const lastDrawNumber = data.value.lastPoolDraw.lotteryDrawNum;

					// 增加几个空白行
					const emptyArray = [];
					for (let i = 1; i <= 4; i++) {
						const emptyObj = {
							periods: +lastDrawNumber + i,
							originText: "",
							first: "", // 千位
							second: "", // 百位
							third: "", // 十位
							four: "", // 个位
							sum: "", // 总和
							type: DataType.Empty, // 类型
							underline: false,
						} as HistoryData;
						emptyArray.push(emptyObj);
					}

					this.fiveDataList = [...resultArray, ...emptyArray];
					console.log(typeof resultArray, "resultArray");
				});
		},
		// 获取七星数据
		fetchLottery7HistoryData() {
			fetch(
				"https://webapi.sporttery.cn/gateway/lottery/getHistoryPageListV1.qry?gameNo=04&provinceId=0&isVerify=1&termLimits=100"
			)
				.then((resp) => {
					if (resp.ok) {
						return resp.json();
					}
				})
				.then((data) => {
					this.sevenDataList = this.handleRecombinationData(data.value.list);
				});
		},
		// 重组数据
		handleRecombinationData(data: Array<Object>) {
			const needUnderlineDay = []; // 需要增加下划线的日期
			const dataList = data.map((d) => {
				let obj = d as any;
				var result = {} as HistoryData;
				// 期数
				result.periods = obj.lotteryDrawNum;
				// 原数据
				result.originText = obj.lotteryDrawResult;
				// 分割数字
				const numArray = obj.lotteryDrawResult
					.split(" ") // 分割
					.map((n: string) => +n) // 转换类型
					.splice(0, 4); // 删除最后一位

				result.first = numArray[0];
				result.second = numArray[1];
				result.third = numArray[2];
				result.four = numArray[3];
				// 总数
				result.sum = numArray.reduce((a: number, b: number) => a + b);
				// 数字类型
				result.type = this.handleDetermineNumberType(numArray);

				// 期数(取后三位)
				const periods = +obj.lotteryDrawNum.slice(-3);
				result.underline = (periods + 1) % 4 === 0; // 找出划线位置(4期一局)

				return result;
			});

			console.log(dataList, "list");
			// // 统计出现次数范围
			const counts: { [key: string]: number } = {}; // 初始化计数器对象
			dataList.forEach((d: { [key: string]: any }) => {
				// if (d.type === DataType.Double) {
				if (counts[d.sum]) {
					counts[d.sum] += 1;
				} else {
					counts[d.sum] = 1;
				}
				// }
			});
			console.log(counts, counts.length);

			return dataList;
		},
		// 判断数字类型
		handleDetermineNumberType(nums: Array<number>) {
			const counts: { [key: string]: number } = {}; // 初始化计数器对象
			nums.forEach((n) => {
				counts[n] = (counts[n] || 0) + 1;
			});

			// 找出出现最多的次数
			const maxCount = Math.max(...Object.values(counts));

			switch (maxCount) {
				case 1:
					return DataType.Single; // 单重
				case 3:
					return DataType.Three; // 三重
				case 4:
					return DataType.Four; // 四重
				default:
					return DataType.Double; // 双重
			}
		},
	},
	components: {
		ShowTable,
	},
})
export default class App extends Vue {
	fiveDataList!: Array<{ [key: string]: any }>;
	sevenDataList!: Array<{ [key: string]: any }>;
	activeName!: String;
}
</script>

<style lang="scss" scoped>
.app-container {
	min-width: 1000px;
	padding: 10px;
	overflow: hidden;
}
</style>
