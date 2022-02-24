/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Panel, Toggle } from '@fluentui/react'
import { memo, useCallback } from 'react'
import styled from 'styled-components'
import { setDarkMode } from '../../localStorageHandler/localStorageHandler.js'
import { useSettings } from '~states/settings'

export interface NavPanelProps {
	isOpen: boolean
	onDismiss: () => void
}

export const NavPanel: React.FC<NavPanelProps> = memo(function NavPanel({
	isOpen,
	onDismiss,
}: NavPanelProps) {
	const [settings, setSettings] = useSettings()

	const setDarkModeStatus = useCallback(
		async (ev: React.MouseEvent<HTMLElement>, checked?: boolean) => {
			const checkedValue = checked ? true : false
			setSettings({ ...settings, isDarkMode: checkedValue })
			await setDarkMode(checkedValue)
		},
		[settings, setSettings],
	)

	return (
		<Panel
			isLightDismiss
			isOpen={isOpen}
			onDismiss={onDismiss}
			closeButtonAriaLabel="Close"
			headerText="Menu"
		>
			<SettingsSection>
				<H3>Settings</H3>
				<Toggle
					label="Dark Mode"
					defaultChecked
					onText="On"
					offText="Off"
					onChange={setDarkModeStatus}
					checked={settings.isDarkMode}
				/>
			</SettingsSection>

			<HelpSection>
				<H3>Help</H3>
			</HelpSection>
		</Panel>
	)
})

const SettingsSection = styled.div`
	margin-left: 10px;
`

const H3 = styled.h3`
	margin-bottom: 10px;
`

const HelpSection = styled.div`
	margin-left: 10px;
	margin-top: 10px;
`