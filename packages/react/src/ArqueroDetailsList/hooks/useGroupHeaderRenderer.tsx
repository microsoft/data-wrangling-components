/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TableMetadata } from '@data-wrangling-components/core'
import { IDetailsGroupDividerProps, IRenderFunction } from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback } from 'react'
import { GroupHeaderFunction } from '..'
import { GroupHeader } from '../../controls'

/**
 * Overrides the default group header rendering so we can inject customization
 * @returns
 */
export function useGroupHeaderRenderer(
	table: ColumnTable,
	computedMetadata: TableMetadata,
	groupHeaderFunction?: GroupHeaderFunction,
	lazyLoadGroups = true,
): IRenderFunction<IDetailsGroupDividerProps> {
	return useCallback(
		(props?, defaultRender?) => {
			if (!props || !defaultRender) {
				return null
			}

			const columnName = table.groups().names[props.groupLevel as number]
			const meta = computedMetadata.columns[columnName]
			if (!groupHeaderFunction) {
				return (
					<GroupHeader
						props={props}
						columnMeta={meta}
						lazyLoadGroups={lazyLoadGroups}
					/>
				)
			}

			return groupHeaderFunction(meta, props)
		},
		[groupHeaderFunction, computedMetadata, table, lazyLoadGroups],
	)
}
