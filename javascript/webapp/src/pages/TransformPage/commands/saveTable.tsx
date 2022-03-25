/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, TableContainer } from '@data-wrangling-components/core'
import type { ICommandBarItemProps } from '@fluentui/react'
import { Callout, IconButton, TextField } from '@fluentui/react'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

export function saveTable(
	steps: Step[],
	table: TableContainer | undefined,
	onSave: any,
	onClick: any,
	hidden: boolean,
	target: any,
): ICommandBarItemProps {
	return {
		key: '--save-table--',
		title: 'Copy this table in your workspace',
		iconOnly: true,
		split: false,
		disabled: steps.length === 0,
		iconProps: {
			iconName: 'Copy',
		},
		onClick,
		onRenderIcon: (props: any, defaultRender: any) => {
			return (
				<>
					<NameEditor
						hidden={hidden}
						target={target}
						onSave={onSave}
						defaultName={`${table?.id} (edited)`}
					/>
					{defaultRender(props)}
				</>
			)
		},
	}
}

const NameEditor = (props: any) => {
	const { hidden, target, onSave, defaultName } = props
	const [name, setName] = useState<string | undefined>()
	useEffect(() => {
		setName(defaultName)
	}, [defaultName])
	const handleNameChange = useCallback((e, v) => setName(v), [setName])
	const handleSaveClick = useCallback(() => onSave(name), [onSave, name])
	return (
		<Callout target={target} hidden={hidden} setInitialFocus>
			<Container>
				<TextField
					placeholder="New name"
					value={name}
					onChange={handleNameChange}
					styles={textFieldStyles}
				/>
				<IconButton
					iconProps={{
						iconName: 'CheckMark',
					}}
					onClick={handleSaveClick}
				/>
			</Container>
		</Callout>
	)
}

const Container = styled.div`
	display: flex;
	padding: 8px;
	gap: 4px;
`

const textFieldStyles = {
	root: {
		width: 300,
	},
}
