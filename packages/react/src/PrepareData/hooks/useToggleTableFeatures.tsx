/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useState, useCallback } from 'react'
import { DetailsListFeatures } from '../../'

export function useToggleTableFeatures(
	features?: Partial<DetailsListFeatures>,
): {
	changeTableFeatures: (feature: string) => void
	tableFeatures: Partial<DetailsListFeatures>
} {
	const [tableFeatures, setTableFeatures] = useState<
		Partial<DetailsListFeatures>
	>(features ?? {})

	const changeTableFeatures = useCallback(
		(propName: string) => {
			const key = propName as keyof DetailsListFeatures
			setTableFeatures({
				...tableFeatures,
				[key]: !tableFeatures[key],
			})
		},
		[tableFeatures, setTableFeatures],
	)

	return {
		changeTableFeatures,
		tableFeatures,
	}
}
