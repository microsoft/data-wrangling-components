/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, TableContainer } from '@data-wrangling-components/core'
import type { DropzoneStyles } from '@data-wrangling-components/react'
import {
	Dropzone,
	PrepareDataFull,
	ProjectMgmtCommandBar,
	useHandleFileUpload,
} from '@data-wrangling-components/react'
import type { FileCollection } from '@data-wrangling-components/utilities'
import { FileExtensions } from '@data-wrangling-components/utilities'
import { MessageBar, MessageBarType } from '@fluentui/react'
import { memo, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import { useHelpFileContentSetter } from '../../states/helpFileContent.js'
import { useTablesState } from './hooks'

export const PrepareDataPage: React.FC = memo(function PrepareDataPage() {
	const [steps, setSteps] = useState<Step[]>([])
	const [outputTable, setOutputTable] = useState<TableContainer>()
	const [tables, updateTables] = useTablesState()
	const setHelpFileContent = useHelpFileContentSetter()
	const handleFileUpload = useHandleFileUpload(setSteps, updateTables)
	const [message, setMessage] = useState<string>()

	const handleDropAcceppted = useCallback(
		(fc: FileCollection) => {
			setMessage(undefined)
			handleFileUpload(fc)
		},
		[setMessage, handleFileUpload],
	)

	useEffect(() => {
		const content = `The pipeline builder web application allows you to perform lightweight data wrangling by constructing a series of transformation steps. At the top of the window is the list of your input tables. Choosing on any of these tables will display the content in the preview pane at the bottom.
		\nBelow the table choosers is a tray for the pipeline's steps. Click "Add step" to create your first transformation. A dialog will open where you can select the type of transformation to apply (i.e., the "verb"). Once you select a verb, the dialog will populate with the required input controls for the verb to execute. Fill these in and click "Save".
		\nThe pipeline you build will run immediately whenever you add or edit steps. The lastest output will be displayed in the bottom half of the window.
		\nYou can add as many steps as you need to craft an output table, and any intermediate tables that are created by the steps are available for use by following steps as well.`

		setHelpFileContent(content)
	})

	return (
		<Container className={'prepare-data-page'}>
			<Dropzone
				acceptedFileTypes={[
					FileExtensions.csv,
					FileExtensions.zip,
					FileExtensions.json,
				]}
				onDropAccepted={handleDropAcceppted}
				onDropRejected={setMessage}
				showPlaceholder={false}
				dropzoneOptions={{ noClick: true }}
				styles={dropzoneStyles as DropzoneStyles}
			/>
			<ProjectMgmtCommandBar
				tables={tables}
				steps={steps}
				outputTable={outputTable}
				onUpdateSteps={setSteps}
				onUpdateTables={updateTables}
			/>
			{message && (
				<MessageBar
					messageBarType={MessageBarType.severeWarning}
					truncated={true}
					onDismiss={() => setMessage(undefined)}
					dismissButtonAriaLabel="Close"
					styles={{ root: { zIndex: 20 } }}
				>
					{' '}
					{message}{' '}
				</MessageBar>
			)}
			<Wrapper>
				<PrepareDataFull
					tables={tables}
					steps={steps}
					onUpdateSteps={setSteps}
					onOutputTable={setOutputTable}
				/>
			</Wrapper>
		</Container>
	)
})

const Container = styled.div`
	height: calc(100vh - 80px);
	position: relative;
`

const Wrapper = styled.div`
	height: 90%;
`

const dropzoneStyles = {
	container: {
		position: 'absolute',
		width: '98%',
		height: '2rem',
		borderColor: 'transparent',
		margin: '0 1%',
		padding: 0,
		borderRadius: 0,
		overflow: 'hidden',
	},
	dragReject: {
		width: '100%',
		height: '100%',
		zIndex: 100,
	},
}
