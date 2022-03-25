/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, TableContainer } from '@data-wrangling-components/core'
import type { ICommandBarItemProps } from '@fluentui/react'
import { useCallback, useMemo, useState } from 'react'

import { saveTable } from '../commands/saveTable.js'

export function useSaveTableCommand(
	steps: Step[],
	table: TableContainer | undefined,
	onCloneTable: (table: TableContainer | undefined, name: string) => void,
): ICommandBarItemProps {
	const [hidden, setHidden] = useState<boolean>(true)
	const [target, setTarget] = useState()
	const handleSave = useCallback(
		name => {
			setHidden(true)
			onCloneTable(table, name)
		},
		[table, onCloneTable, setHidden],
	)
	const handleClick = useCallback(
		e => {
			setTarget(e.target.parentNode)
			setHidden(prev => !prev)
		},
		[setTarget, setHidden],
	)
	const handleCancel = useCallback(() => setHidden(true), [setHidden])
	return useMemo(() => {
		return saveTable(
			steps,
			table,
			handleSave,
			handleClick,
			handleCancel,
			hidden,
			target,
		)
	}, [steps, table, hidden, target, handleClick, handleSave, handleCancel])
}
