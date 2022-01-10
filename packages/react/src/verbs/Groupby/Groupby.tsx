/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import { ColumnListInputs } from '../../controls'
import { StepComponentProps } from '../../types'

/**
 * Provides inputs for a Groupby step.
 */
export const Groupby: React.FC<StepComponentProps> = memo(function Groupby({
	step,
	store,
	onChange,
}) {
	return <ColumnListInputs step={step} store={store} onChange={onChange} />
})