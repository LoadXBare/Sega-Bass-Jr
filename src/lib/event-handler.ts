import * as events from '../events/index.js';

export const eventHandler = (event: string, args: unknown): void => events[event](args);