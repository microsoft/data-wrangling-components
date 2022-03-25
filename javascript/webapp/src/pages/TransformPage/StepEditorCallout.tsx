/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	Step,
	TableContainer,
	TableStore,
} from '@data-wrangling-components/core'
import { Callout, DirectionalHint } from '@fluentui/react'
import { useCallback } from 'react'

import { StepEditor } from './StepEditor.js'

export interface StepEditorCalloutProps {
	column?: string
	input: TableContainer
	store: TableStore
	step?: Step
	onSave: (step: Step) => void
	onCancel: () => void
	target?: any
}

/**
 * Hosts the StepEditor in a callout
 * @param props
 * @returns
 */
export const StepEditorCallout: React.FC<StepEditorCalloutProps> = (
	props: any,
) => {
	const { column, input, store, step, onSave, onCancel, target } = props

	const handleDismiss = useCallback(() => onCancel(), [onCancel])

	if (!step) {
		return null
	}

	return (
		<Callout
			target={target}
			directionalHint={DirectionalHint.bottomAutoEdge}
			styles={calloutStyles}
			hidden={!step}
			onDismiss={handleDismiss}
		>
			<StepEditor
				column={column}
				input={input}
				store={store}
				step={step}
				onCancel={onCancel}
				onSave={onSave}
			/>
		</Callout>
	)
}

const calloutStyles = {
	root: {
		width: 360,
		maxHeight: 800,
	},
}
