/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	TableContainer,
	TableMetadata,
	TableStore,
} from '@data-wrangling-components/core'
import { useCallback } from 'react'

export function useOnUpdateMetadata(
	setStoredTables: (tables: Map<string, TableContainer<unknown>>) => void,
	store: TableStore,
	selectedTableName?: string,
): (meta: TableMetadata) => void {
	return useCallback(
		async (meta: TableMetadata) => {
			const _table = await store.get(selectedTableName as string)
			_table.metadata = meta
			store.delete(_table.id)
			store.set(_table)
			const _storedTables = await store.toMap()
			setStoredTables(_storedTables)
		},
		[store, selectedTableName, setStoredTables],
	)
}
