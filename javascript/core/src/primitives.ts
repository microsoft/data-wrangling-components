/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export type Maybe<T> = T | undefined

/**
 * Function callback for general activity listener.
 */
export type Handler = () => void

export type HandlerOf<T> = (input: T) => void

export type Unsubscribe = Handler

export type CopyWithPartial<T, K extends keyof T> = Omit<T, K> & Partial<T>

export function handleMaybeAsync<T>(
	value: T | Promise<T>,
	handler: (value: T) => void,
): Promise<void> | void {
	if ((value as any).then) {
		return (value as Promise<T>).then(v => handler(v))
	} else {
		handler(value as T)
	}
}
