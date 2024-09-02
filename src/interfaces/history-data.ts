import type { TableColumnCtx } from "element-plus";

// 数据类型
export enum DataType {
	Single = "单重",
	Double = "双重",
	Three = "三重",
	Four = "四重",
	Empty = "",
}

export interface HistoryData {
	periods: string | number; // 期数
	originText: string; // 原数据
	first: number | string; // 千位
	second: number | string; // 百位
	third: number | string; // 十位
	four: number | string; // 个位
	sum: number | string; // 总和
	type: DataType; // 类型
	underline: boolean; // 是否增加下划线
}

export interface SummaryMethodProps<T = HistoryData> {
	columns: TableColumnCtx<T>[];
	data: T[];
}
