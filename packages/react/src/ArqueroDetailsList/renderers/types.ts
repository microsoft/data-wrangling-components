/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ColumnMetadata } from '@data-wrangling-components/core'
import { IColumn } from '@fluentui/react'

export type Dimensions = {
	width: number
	height: number
}

/**
 * Basic props for a column cell's render function
 */
export interface ColumnCellProps {
	item?: any
	index?: number
	column?: IColumn
}

export interface ColumnCellChartProps extends ColumnCellProps {
	color?: string
	categories?: Record<string | number, number>
}

export interface FormattedCellProps extends ColumnCellProps {
	textAlign?: 'left' | 'center' | 'right'
	/**
	 * d3-format compatible format specifier for numbers
	 * https://github.com/d3/d3-format
	 */
	numberFormat?: string
	color?: string
}

export interface MagnitudeCellProps extends FormattedCellProps {
	/**
	 * Value from 0-1 indicating relative magnitude within the column
	 */
	magnitude?: number
}

export interface RichCellProps extends FormattedCellProps {
	metadata: ColumnMetadata
}
