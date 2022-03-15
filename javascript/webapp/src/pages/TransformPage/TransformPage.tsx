/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	OrderbyStep,
	Step,
	TableContainer,
} from '@data-wrangling-components/core'
import {
	ParseType,
	runPipeline,
	SortDirection,
	Verb,
} from '@data-wrangling-components/core'
import {
	ArqueroDetailsList,
	ArqueroTableHeader,
	createDefaultCommandBar,
	StatsColumnType,
} from '@data-wrangling-components/react'
import { IconButton } from '@fluentui/react'
import { loadCSV } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { isEqual, merge } from 'lodash'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

/**
 * This is a page for testing out built-in table transform mechanisms
 */
export const TransformPage: React.FC = memo(function PerfMage() {
	const [table, setTable] = useState<TableContainer>()
	useEffect(() => {
		const f = async () => {
			const root = await loadCSV('data/stocks.csv', {
				autoType: false,
			})
			setTable({
				id: 'data/stocks.csv',
				table: root,
			})
		}
		void f()
	}, [])
	const [steps, setSteps] = useState<Step[]>([])

	const [result, setResult] = useState<ColumnTable | undefined>()
	useEffect(() => {
		const f = async () => {
			const res = await runPipeline(table!.table!, steps)
			setResult(res.table)
		}
		if (table) {
			if (steps.length > 0) {
				f()
			} else {
				setResult(table.table)
			}
		}
	}, [table, steps, setResult])

	const handleAddStep = useCallback(
		step => {
			setSteps(prev => [...prev, step])
		},
		[setSteps],
	)
	const handleRemoveStep = useCallback(
		step => {
			setSteps(prev => {
				const found = findStep(prev, step)
				const copy = [...prev]
				const splice = [...copy.slice(0, found), ...copy.slice(found + 1)]
				return splice
			})
		},
		[setSteps],
	)
	const handleUpdateStep = useCallback(
		(step, update) => {
			setSteps(prev => {
				const found = findStep(prev, step)
				const merged = merge({}, step, update)
				const copy = [...prev]
				copy[found] = merged
				return copy
			})
		},
		[setSteps],
	)

	const columnCommands = useMemo(() => {
		return (props: any) => {
			return createDefaultCommandBar([
				{
					key: 'groupby',
					text: 'Group by',
					onRender: () => {
						const step: Partial<Step> = {
							verb: Verb.Groupby,
							args: {
								columns: [props.column.key],
							},
						}
						const exists = findStep(steps, step) >= 0
						return (
							<IconButton
								title={`Group table by ${props.column.key} column`}
								checked={exists}
								iconProps={{ iconName: 'GroupList' }}
								onClick={() =>
									exists ? handleRemoveStep(step) : handleAddStep(step)
								}
							/>
						)
					},
				},
				{
					key: 'convert',
					text: 'Convert to number',
					onRender: () => {
						const step: Partial<Step> = {
							verb: Verb.Convert,
							args: {
								columns: [props.column.key],
								type: ParseType.Decimal,
							},
						}
						const exists = findStep(steps, step) >= 0
						return (
							<IconButton
								title={`Convert column data to numbers`}
								checked={exists}
								iconProps={{ iconName: 'NumberSymbol' }}
								onClick={() =>
									exists ? handleRemoveStep(step) : handleAddStep(step)
								}
							/>
						)
					},
				},
				{
					key: 'orderby',
					text: 'Sort column',
					onRender: () => {
						const step: Partial<Step> = {
							verb: Verb.Orderby,
							args: {
								orders: [
									{
										column: props.column.key,
										direction: SortDirection.Ascending,
									},
								],
							},
						}
						const index = findStep(
							steps,
							step,
							(left: OrderbyStep, right: OrderbyStep) =>
								left.verb === Verb.Orderby &&
								left.args.orders[0].column === right.args.orders[0].column,
						)
						const exists = index >= 0
						const found = steps[index] as OrderbyStep
						const order = found?.args.orders[0].direction
						let icon = 'Sort'
						if (order === SortDirection.Ascending) {
							icon = 'SortUp'
						} else if (order === SortDirection.Descending) {
							icon = 'SortDown'
						}
						const click = () => {
							if (!exists) {
								handleAddStep(step)
							} else if (order === SortDirection.Ascending) {
								handleUpdateStep(found, {
									args: {
										orders: [
											{
												column: props.column.key,
												direction: SortDirection.Descending,
											},
										],
									},
								})
							} else {
								handleRemoveStep(found)
							}
						}
						const title =
							order === SortDirection.Ascending
								? `Order table descending by ${props.column.key}`
								: order === SortDirection.Descending
								? `Remove table order by ${props.column.key}`
								: `Order table ascending by ${props.column.key}`
						return (
							<IconButton
								title={title}
								checked={exists}
								iconProps={{ iconName: icon }}
								onClick={click}
							/>
						)
					},
				},
			])
		}
	}, [steps, handleAddStep, handleRemoveStep, handleUpdateStep])

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

function findStep(steps: Step[], step: Partial<Step>, compare?: any): number {
	return steps.findIndex(s => (compare ? compare(s, step) : isEqual(s, step)))
}
