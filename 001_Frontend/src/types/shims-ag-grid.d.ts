declare module 'ag-grid-community' {
	// Minimal types used in this workspace
	export type ColDef<T = any> = any;
	export type ValueSetterParams = any;
	export interface ICellRendererParams<TData = any, TValue = any> {
		data?: TData;
		value?: TValue;
		context?: any;
	}
	export interface IHeaderParams {
		displayName?: string;
		// index signature for other params
		[key: string]: any;
	}
	export type ICellRendererComp = any;
}

declare module 'ag-grid-react' {
	import React from 'react';
	export const AgGridReact: React.ComponentType<any>;
}

declare module 'immer' {
	export function produce<T>(base: T, recipe: (draft: T) => void): T;
}
