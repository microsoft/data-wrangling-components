/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ImputeArgs } from '@data-wrangling-components/core'
import { memo } from 'react'

import { withLoadedTable } from '../hocs/index.js'
import { useTableColumnNames } from '../hooks/index.js'
import type { StepComponentProps } from '../types.js'
import { ImputeBase } from './Impute.base.js'

/**
 * Just the to/value inputs for an impute.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Impute: React.FC<StepComponentProps<ImputeArgs>> = memo(
	withLoadedTable(function Impute({ step, onChange, dataTable }) {
		const columns = useTableColumnNames(dataTable)
		return <ImputeBase step={step} onChange={onChange} columns={columns} />
	}),
)
