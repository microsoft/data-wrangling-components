/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export type CompareWrapper = {
	expr: any
	escape: boolean
	toString: any
}

export type ExprFunction = (d: any, $: any) => any

export type ExprFunctionMap = Record<string, ExprFunction>
