/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const { configure } = require('@essex/jest-config')
module.exports = {
	projects: [
		{
			...configure(),
			displayName: 'dom',
			testEnvironment: 'jsdom',
			testMatch: ['**/__tests__/**/*.test.ts'],
			extensionsToTreatAsEsm: ['.ts'],
			setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
		},
		{
			...configure(),
			displayName: 'node',
			testEnvironment: 'node',
			extensionsToTreatAsEsm: ['.ts'],
			testMatch: ['**/__tests__/**/*.spec.ts'],
		},
	],
}
