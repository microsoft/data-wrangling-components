/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDetailsGroupDividerProps, IGroup } from '@fluentui/react'
import { IconButton } from '@fluentui/react'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Else as RawElse, If as RawIf, Then as RawThen } from 'react-if'
import styled from 'styled-components'

import { useIntersection } from './GroupHeader.hooks.js'

const Else = RawElse as React.FC<React.PropsWithChildren<unknown>>
const If = RawIf as React.FC<React.PropsWithChildren<{ condition: boolean }>>
const Then = RawThen as React.FC<React.PropsWithChildren<unknown>>

interface GroupHeaderProps {
	props: IDetailsGroupDividerProps
	lazyLoadGroups: boolean
	columnName?: string
}

export const GroupHeader: React.FC<React.PropsWithChildren<GroupHeaderProps>> =
	memo(function GroupHeader({ columnName, props, children, lazyLoadGroups }) {
		const { group, onToggleCollapse } = props
		const ref = useRef<HTMLDivElement>()
		// whether the element toggle is manual or by visibility on scroll
		const [manualToggle, setManualToggle] = useState(false)

		// trigger as soon as the element becomes visible
		const inViewport = useIntersection(ref.current, '0px')

		const countChildren = useCallback((children: IGroup[]) => {
			let total = 0
			children.forEach(child => {
				total += child.count
				total += child.children ? countChildren(child.children) : 0
			})
			return total
		}, [])

		useEffect(() => {
			if (inViewport && group?.isCollapsed) {
				onToggleCollapse?.(group)
			}
		}, [inViewport, group, onToggleCollapse])

		const onManualLevelToggle = useCallback(() => {
			setManualToggle(true)
			onToggleCollapse?.(group as IGroup)
		}, [group, onToggleCollapse, setManualToggle])

		const shouldLazyLoad = useMemo((): boolean => {
			return lazyLoadGroups && (group?.level as number) > 0 && !manualToggle
		}, [group, lazyLoadGroups, manualToggle])

		return (
			<HeaderContainer
				// uses the ref to toggle if element is into view if the user didn't toggled it with the button
				ref={(element: HTMLDivElement) =>
					(ref.current = shouldLazyLoad ? element : undefined)
				}
				groupLevel={group?.level as number}
			>
				<LevelButton
					onClick={onManualLevelToggle}
					iconProps={{
						iconName: group?.isCollapsed ? 'ChevronRight' : 'ChevronDown',
					}}
				></LevelButton>
				<If condition={!!children}>
					<Then>{children}</Then>
					<Else>
						<HeaderDetailsText>
							<Bold>
								{columnName ? `${columnName}  - ` : ''}
								{group?.name}
							</Bold>
						</HeaderDetailsText>
						<HeaderDetailsText>Children: {group?.count}</HeaderDetailsText>
						{group?.children && (
							<HeaderDetailsText>
								Total Items: {countChildren(group?.children)}
							</HeaderDetailsText>
						)}
					</Else>
				</If>
			</HeaderContainer>
		)
	})

const HeaderContainer = styled.div<{ groupLevel: number }>`
	padding-left: ${({ groupLevel }) => `${groupLevel * 12}px`};
	display: flex;
	gap: 8px;
`

const LevelButton = styled(IconButton as any)`
	width: 5%;
`

const HeaderDetailsText = styled.span`
	align-self: center;
`

const Bold = styled.b``
