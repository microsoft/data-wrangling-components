/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableStore } from '@data-wrangling-components/core'
import type { TableContainer } from '@essex/arquero'
import { useCallback } from 'react'
import { from } from 'rxjs'

export function useAddNewTables(
	store: TableStore,
): (tables: TableContainer[]) => void {
	return useCallback(
		(tables: TableContainer[]) => {
			const existing = store.list()
			tables.forEach(table => {
				const isStored = existing.includes(table.id)
				if (!isStored) {
					store.set(table.id, from([table]))
				}
			})
		},
		[store],
	)
}