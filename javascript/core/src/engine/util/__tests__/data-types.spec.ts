import { bool } from '../data-types.js'

describe('data-types utils', () => {
	describe('bool cast', () => {
		test('true values', () => {
			expect(bool(true)).toBe(true)
			expect(bool('hi')).toBe(true)
			expect(bool(1)).toBe(true)
			expect(bool({})).toBe(true)
		})

		test('false values', () => {
			expect(bool(false)).toBe(false)
			expect(bool('false')).toBe(false)
			expect(bool(0)).toBe(false)
			expect(bool()).toBe(false)
			expect(bool(undefined)).toBe(false)
			expect(bool(null)).toBe(false)
		})
	})
})
