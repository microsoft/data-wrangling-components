/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption, IDropdownProps } from '@fluentui/react'
import { Dropdown } from '@fluentui/react'
import { memo, useMemo } from 'react'

import { opDropdownStyles } from './styles.js'

export interface EnumDropdownProps<E = unknown>
	extends Omit<IDropdownProps, 'options'> {
	enumeration: E
	/**
	 * Optional labels to map enum keys to alternet text
	 */
	labels?: Record<string, string>
}

/**
 * Dropdown wrapper to list out aggregation operations.
 */
export const EnumDropdown: React.FC<EnumDropdownProps> = memo(
	function EnumDropdown(props) {
		const options = useOptions(props.enumeration, props.labels)
		return <Dropdown options={options} styles={opDropdownStyles} {...props} />
	},
)

function useOptions<E = unknown>(
	enumeration: E,
	labels?: Record<string, string>,
): IDropdownOption[] {
	return useMemo(() => {
		const options = Object.entries(enumeration).map(entry => {
			const [name, key] = entry
			const text = (labels && labels[key]) || format(name)
			return {
				key,
				text,
			}
		})
		return options
	}, [enumeration, labels])
}

/**
 * Formats a TitleCase enum name into a friendly-readable string
 * E.g. "TitleCase" => "Title case"
 * @param name
 * @returns
 */
function format(name: string): string {
	const parts = name
		.replace(/([A-Z])/g, ' $1')
		.trim()
		.split(/\s/)
	const first = parts[0]
	const rest = parts.slice(1).map(p => p.toLocaleLowerCase())
	return [first, ...rest].join(' ')
}
