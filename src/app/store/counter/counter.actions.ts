import { createAction } from '@ngrx/store';

export const increment = createAction('[Counter Component] INCREMENT');
export const decrement = createAction('[Counter Component] DECREMENT');
export const reset = createAction('[Counter Component] RESET');
