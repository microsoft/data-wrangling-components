/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BinStep } from '@data-wrangling-components/core'
import { BinStrategy } from '@data-wrangling-components/core'
import { Checkbox, Position, SpinButton } from '@fluentui/react'
import { memo, useMemo } from 'react'
import { Case, If, Switch, Then } from 'react-if'
import styled from 'styled-components'

import {
	LeftAlignedRow,
	useHandleCheckboxChange,
	useHandleDropdownChange,
	useHandleSpinButtonChange,
} from '../../common/index.js'
import { BinStrategyDropdown } from '../../controls/index.js'
import { dropdownStyles } from '../../controls/styles.js'
import type { StepComponentProps } from '../../types.js'

/**
 * Provides inputs for a binning step.
 */
export const Bin: React.FC<StepComponentProps> = memo(function Bin({
	step,
	onChange,
}) {
	const internal = useMemo(() => step as BinStep, [step])

	const handleBinStrategyChange = useHandleDropdownChange(
		internal,
		'args.strategy',
		onChange,
	)

	const handleBinCountChange = useHandleSpinButtonChange(
		internal,
		'args.fixedcount',
		onChange,
	)
	const handleBinSizeChange = useHandleSpinButtonChange(
		internal,
		'args.fixedwidth',
		onChange,
	)

	const handleMinChange = useHandleSpinButtonChange(
		internal,
		'args.min',
		onChange,
	)

	const handleMaxChange = useHandleSpinButtonChange(
		internal,
		'args.max',
		onChange,
	)

	const handleClampChange = useHandleCheckboxChange(
		internal,
		'args.clamped',
		onChange,
	)

	return (
		<Container>
			<LeftAlignedRow>
				<BinStrategyDropdown
					required
					selectedKey={internal.args.strategy}
					styles={dropdownStyles}
					onChange={handleBinStrategyChange}
				/>
			</LeftAlignedRow>
			<LeftAlignedRow>
				<Switch>
					<Case condition={internal.args.strategy === BinStrategy.FixedCount}>
						<SpinButton
							key={`spin-count`}
							label={'Bin count'}
							labelPosition={Position.top}
							min={1}
							max={100}
							step={1}
							value={
								internal.args.fixedcount
									? `${internal.args.fixedcount}`
									: undefined
							}
							styles={dropdownStyles}
							onChange={handleBinCountChange}
						/>
					</Case>
					<Case condition={internal.args.strategy === BinStrategy.FixedWidth}>
						<SpinButton
							key={`spin-size`}
							label={'Bin size'}
							labelPosition={Position.top}
							value={
								internal.args.fixedwidth
									? `${internal.args.fixedwidth}`
									: undefined
							}
							styles={dropdownStyles}
							onChange={handleBinSizeChange}
						/>
					</Case>
				</Switch>
			</LeftAlignedRow>
			<If condition={internal.args.strategy !== BinStrategy.Auto}>
				<Then>
					<LeftAlignedRow>
						<SpinButton
							label={'Min boundary'}
							labelPosition={Position.top}
							value={internal.args.min ? `${internal.args.min}` : undefined}
							styles={dropdownStyles}
							onChange={handleMinChange}
						/>
					</LeftAlignedRow>
					<LeftAlignedRow>
						<SpinButton
							label={'Max boundary'}
							labelPosition={Position.top}
							value={internal.args.max ? `${internal.args.max}` : undefined}
							styles={dropdownStyles}
							onChange={handleMaxChange}
						/>
					</LeftAlignedRow>
					<LeftAlignedRow>
						<Checkbox
							label={'Clamp to min/max'}
							checked={internal.args.clamped}
							onChange={handleClampChange}
						/>
					</LeftAlignedRow>
				</Then>
			</If>
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`
