/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import { memo } from 'react'

import { useHandleFileUpload } from '../hooks/uploads.js'
import { CommandBar } from './CommandBar.js'
import { Dropzone } from './Dropzone.js'
import {
	useOnUpdateWorkflowJson,
	useProjectMgmtCommands,
} from './ProjectMgmtCommandBar.hooks.js'
import { bgColor, color, dropzone } from './ProjectMgmtCommandBar.styles.js'
import type { ProjectMgmtCommandBarProps } from './ProjectMgmtCommandBar.types.js'

export const ProjectMgmtCommandBar: React.FC<ProjectMgmtCommandBarProps> = memo(
	function ProjectMgmtCommandBar({
		workflow,
		tables,
		outputTables,
		onUpdateWorkflow,
		onUpdateTables,
		...props
	}) {
		const theme = useThematic()
		const onUpdateWorkflowJson = useOnUpdateWorkflowJson(onUpdateWorkflow)
		const commands = useProjectMgmtCommands(
			workflow,
			tables,
			outputTables,
			onUpdateWorkflowJson,
			onUpdateTables,
		)
		const onDrop = useHandleFileUpload(onUpdateWorkflowJson, onUpdateTables)

		return (
			<Dropzone
				acceptedFileTypes={['.csv', '.json', '.zip']}
				onDrop={onDrop}
				styles={dropzone}
			>
				<CommandBar
					items={commands}
					bgColor={bgColor(theme)}
					color={color(theme)}
					{...props}
				/>
			</Dropzone>
		)
	},
)
