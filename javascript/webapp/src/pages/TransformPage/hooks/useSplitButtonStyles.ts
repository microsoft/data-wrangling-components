/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IButtonStyles } from '@fluentui/react'
import { useThematicFluent } from '@thematic/fluent'
import { useMemo } from 'react'

/**
 * Override styles on the SplitButton to make a
 * compact dropdown selector that matches theming more closely
 * than the defaults.
 * @returns
 */
export function useSplitButtonStyles(): IButtonStyles {
	const theme = useThematicFluent()
	return useMemo(
		() => ({
			root: {
				padding: 0,
			},
			splitButtonContainer: {
				borderRadius: 2,
			},
			splitButtonContainerHovered: {
				background: theme.palette.neutralLighter,
			},
			splitButtonContainerChecked: {
				background: theme.palette.neutralLight,
			},
			splitButtonMenuButton: {
				padding: '0 2px',
				border: 'none',
				background: 'none',
				width: 12,
				minWidth: 12,
				maxWidth: 12,
			},
			splitButtonMenuIcon: {
				fontSize: 8,
				color: theme.palette.neutralPrimary,
			},
		}),
		[theme],
	)
}
