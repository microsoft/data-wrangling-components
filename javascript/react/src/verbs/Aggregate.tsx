/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { AggregateArgs } from '@data-wrangling-components/core'
import { memo } from 'react'

import { withLoadedTable } from '../hocs/index.js'
import { useTableColumnNames } from '../hooks/index.js'
import { AggregateBase } from './Aggregate.base.js'

/*
 * Just the group/column/op inputs for an aggregation.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Aggregate = memo(
	withLoadedTable<AggregateArgs>(function Aggregate({
		step,
		onChange,
		dataTable,
	}) {
		const columns = useTableColumnNames(dataTable)
		return <AggregateBase columns={columns} step={step} onChange={onChange} />
	}),
)
