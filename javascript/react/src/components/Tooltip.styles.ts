/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'
import { Callout as FluentCallout } from '@fluentui/react'

export const Container = styled.div``

export const Callout = styled(FluentCallout)`
	.ms-Callout-main {
		width: 350px;
		padding: 1.5rem 2rem;
	}
`

export const icons = {
	info: { iconName: 'Info' },
}
