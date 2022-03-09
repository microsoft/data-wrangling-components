/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step, TableStore, Verb } from '@data-wrangling-components/core'
import { factory } from '@data-wrangling-components/core'
import { useCallback, useEffect, useState } from 'react'

import { useCreateTableName, useFormatedColumnArg } from '../../common/index.js'

export function useInternalTableStep(
	step: Step | undefined,
	lastOutput: string | undefined,
	store: TableStore,
): {
	internal: Step | undefined
	handleVerbChange: (verb: Verb) => void
	setInternal: (step?: Step) => void
} {
	const [internal, setInternal] = useState<Step | undefined>()
	const formattedColumnArg = useFormatedColumnArg()

	useEffect(() => {
		if (step) {
			setInternal(step)
		}
	}, [step, setInternal])

	const newTableName = useCreateTableName(store)

	const handleVerbChange = useCallback(
		(verb: Verb) => {
			const _step = factory(
				verb,
				lastOutput ?? '',
				newTableName(`table-${verb}`),
			)

			_step.args = formattedColumnArg(_step.args)
			setInternal(_step)
		},
		[lastOutput, setInternal, newTableName, formattedColumnArg],
	)

	return { internal, handleVerbChange, setInternal }
}
