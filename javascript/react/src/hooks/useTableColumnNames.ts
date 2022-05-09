/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'

export function useTableColumnNames(
	table: ColumnTable | undefined,
	filter?: (name: string) => boolean,
): string[] {
	return useMemo(() => table?.columnNames(filter) || [], [table, filter])
}
