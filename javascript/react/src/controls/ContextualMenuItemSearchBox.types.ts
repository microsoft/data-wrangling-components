/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IContextualMenuItem } from '@fluentui/react'

export interface ContextualMenuItemSearchBoxProps {
	items: IContextualMenuItem[]
	onSearch: (results: IContextualMenuItem[]) => void
}
