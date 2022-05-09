/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface TableCardProps {
	index: number
	tableName: string
	isSelected: (name: string) => boolean
	onSelect?: (name: string) => void
}
