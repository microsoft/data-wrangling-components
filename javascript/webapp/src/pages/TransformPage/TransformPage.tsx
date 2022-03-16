/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ArqueroDetailsList,
	ArqueroTableHeader,
	createDefaultCommandBar,
	StatsColumnType,
} from '@data-wrangling-components/react'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

import { convertNumber } from './commands/convertNumber.js'
import { groupby } from './commands/groupby.js'
import { orderby } from './commands/orderby.js'
import { useResult, useSteps, useTable } from './TransformPage.hooks.js'

/**
 * This is a page for testing out built-in table transform mechanisms
 */
export const TransformPage: React.FC = memo(function PerfMage() {
	const table = useTable()

	const { steps, onAddStep, onUpdateStep, onRemoveStep } = useSteps()

	const result = useResult(table, steps)

	const columnCommands = useMemo(() => {
		return (props: any) => {
			return createDefaultCommandBar([
				groupby(
					steps,
					props?.column.key,
					onAddStep,
					onUpdateStep,
					onRemoveStep,
				),
				convertNumber(
					steps,
					props?.column.key,
					onAddStep,
					onUpdateStep,
					onRemoveStep,
				),
				orderby(
					steps,
					props?.column.key,
					onAddStep,
					onUpdateStep,
					onRemoveStep,
				),
			])
		}
	}, [steps, onAddStep, onRemoveStep, onUpdateStep])

	if (!result) {
		return null
	}
	return (
		<Container>
			<Table>
				<ArqueroTableHeader table={result} />
				<ArqueroDetailsList
					table={result}
					isHeadersFixed
					features={{
						statsColumnHeaders: true,
						statsColumnTypes: [
							StatsColumnType.Type,
							StatsColumnType.Count,
							StatsColumnType.Distinct,
							StatsColumnType.Invalid,
							StatsColumnType.Min,
							StatsColumnType.Max,
							StatsColumnType.Mean,
						],
						commandBar: [columnCommands],
						histogramColumnHeaders: true,
					}}
				/>
			</Table>
		</Container>
	)
})

const Container = styled.div`
	padding: 0px 20px 0px 20px;
`

const Table = styled.div`
	margin-top: 12px;
	width: 1200px;
	height: 800px;
`
