/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { WorkflowObject } from '@data-wrangling-components/core'
import { Workflow } from '@data-wrangling-components/core'
import type { TableContainer } from '@essex/arquero'
import type { ICommandBarItemProps } from '@fluentui/react'
import { useCallback, useMemo } from 'react'

import {
	useDownloadCsv,
	useDownloadWorkflow,
	useDownloadZip,
} from '../hooks/downloads.js'
import {
	useHandleCsvUpload,
	useHandleJsonUpload,
	useHandleZipUpload,
} from '../hooks/uploads.js'

export function useProjectMgmtCommands(
	workflow: Workflow,
	tables: TableContainer[],
	outputTables: TableContainer[],
	onUpdateWorkflow: (workflow: Workflow) => void,
	onUpdateTables: (tables: TableContainer[]) => void,
): ICommandBarItemProps[] {
	const onUpdateWorkflowJson = useCallback(
		(wf: WorkflowObject) => onUpdateWorkflow(new Workflow(wf)),
		[onUpdateWorkflow],
	)
	const downloadPipeline = useDownloadWorkflow(workflow)
	const downloadCsv = useDownloadCsv(outputTables)
	const downloadZip = useDownloadZip(workflow, tables, outputTables)
	const handleJsonUpload = useHandleJsonUpload(onUpdateWorkflowJson)
	const handleCsvUpload = useHandleCsvUpload(onUpdateTables)
	const handleZipUpload = useHandleZipUpload(
		onUpdateWorkflowJson,
		onUpdateTables,
	)

	const commands: ICommandBarItemProps[] = useMemo(() => {
		return [
			{
				key: 'open',
				text: 'Open',
				iconProps: icons.openFile,
				subMenuProps: {
					items: [
						{
							key: 'csv',
							text: 'CSV table',
							iconProps: icons.table,
							onClick: handleCsvUpload,
						},
						{
							key: 'json',
							text: 'Pipeline (.json)',
							iconProps: icons.code,
							onClick: handleJsonUpload,
						},
						{
							key: 'zip',
							text: 'Zip project',
							iconProps: icons.zipFolder,
							onClick: handleZipUpload,
						},
					],
				},
			},
			{
				key: 'save',
				text: 'Save',
				iconProps: icons.save,
				subMenuProps: {
					items: [
						{
							key: 'csv',
							text: 'CSV table',
							iconProps: icons.table,
							onClick: downloadCsv,
						},
						{
							key: 'json',
							text: 'Pipeline (.json)',
							iconProps: icons.code,
							onClick: downloadPipeline,
						},
						{
							key: 'zip',
							text: 'Zip project',
							iconProps: icons.zipFolder,
							onClick: downloadZip,
						},
					],
				},
			},
		] as ICommandBarItemProps[]
	}, [
		downloadPipeline,
		downloadCsv,
		downloadZip,
		handleJsonUpload,
		handleCsvUpload,
		handleZipUpload,
	])

	return commands
}

const icons = {
	save: { iconName: 'Save' },
	openFile: { iconName: 'OpenFile' },
	table: { iconName: 'Table' },
	code: { iconName: 'Code' },
	zipFolder: { iconName: 'ZipFolder' },
}
