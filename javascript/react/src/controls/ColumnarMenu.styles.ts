/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IButtonStyles } from '@fluentui/react'

export const dropdownButtonStyles: IButtonStyles = {
	root: {
		width: 220,
		// match the dropdowns for better visual alignment
		paddingLeft: 4,
		paddingRight: 4,
		textAlign: 'left',
	},
	label: {
		fontWeight: 'normal',
	},
}
