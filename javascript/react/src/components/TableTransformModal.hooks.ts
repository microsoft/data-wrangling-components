/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphManager, Step, Verb } from '@data-wrangling-components/core'
import { readStep } from '@data-wrangling-components/core'
import {
	withInputColumnDropdown,
	withInputTableDropdown,
	withOutputColumnTextfield,
	withOutputTableTextfield,
} from '@data-wrangling-components/react-hocs'
import type { StepComponentProps } from '@data-wrangling-components/react-types'
import { selectStepComponent } from '@data-wrangling-components/react-verbs'
import type { IModalStyleProps, IModalStyles } from '@fluentui/react'
import type { IStyleFunctionOrObject } from '@fluentui/utilities'
import { useThematic } from '@thematic/react'
import flow from 'lodash-es/flow.js'
import merge from 'lodash-es/merge.js'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useCreateTableName, useFormattedColumnArg } from '../hooks/index.js'

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export function useHandleTableRunClick(
	step: Step | undefined,
	onTransformRequested?: (step: Step) => void,
): () => void {
	return useCallback(() => {
		if (step) {
			onTransformRequested?.(step)
		}
	}, [onTransformRequested, step])
}

export function useHandleTableStepArgs(
	step: Step | undefined,
	disabled?: boolean,
): React.FC<StepComponentProps> | undefined {
	const Component = useMemo(
		() => (step ? selectStepComponent(step) : null),
		[step],
	)

	const WithAllArgs = useMemo(() => {
		if (Component) {
			return flow(
				withOutputTableTextfield(
					output => {
						console.log('ADD OUTPUT', output)
					},
					undefined,
					disabled,
				),
				withOutputColumnTextfield(),
				withInputColumnDropdown(),
				withInputTableDropdown(),
			)(Component)
		}
	}, [Component, disabled])

	return WithAllArgs
}

export function useInternalTableStep(
	step: Step | undefined,
	_lastOutput: string | undefined,
	graph: GraphManager,
): {
	internal: Step | undefined
	handleVerbChange: (verb: Verb) => void
	setInternal: (step?: Step) => void
} {
	const [internal, setInternal] = useState<Step | undefined>()
	const formattedColumnArg = useFormattedColumnArg()

	useEffect(() => {
		if (step) {
			setInternal(step)
		}
	}, [step, setInternal])

	const createNewTableName = useCreateTableName(graph)

	const handleVerbChange = useCallback(
		(verb: Verb) => {
			const id = createNewTableName(verb)
			const _step = readStep({ verb, id })
			_step.args = formattedColumnArg(_step.args)
			setInternal(_step)
		},
		[setInternal, formattedColumnArg, createNewTableName],
	)

	return { internal, handleVerbChange, setInternal }
}
/**
 * Defaults modal to have a slight border that is adapted for theme
 * @param styles
 * @returns
 */
export function useModalStyles(
	styles?: IStyleFunctionOrObject<IModalStyleProps, IModalStyles>,
	includeGuidance = false,
): IStyleFunctionOrObject<IModalStyleProps, IModalStyles> {
	const theme = useThematic()
	return useMemo(() => {
		return merge(
			{
				root: {
					border: `1px solid ${theme.application().faint().hex()}`,
					width: includeGuidance ? 800 : 360,
					maxHeight: 580,
				},
			},
			styles,
		)
	}, [theme, styles, includeGuidance])
}
