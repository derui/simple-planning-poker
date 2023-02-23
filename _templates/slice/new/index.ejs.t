---
to: src/status/slices/<%= name %>.ts
---

import {createSlice} from '@reduxjs/toolkit';

interface <%= h.changeCase.pascal(name) %>State {
  // state of slice
}

const initialState = {

} satisfies <%= h.changeCase.pascal(name) %>State;

const slice = createSlice({
  name: '<%= h.changeCase.camel(name) %>',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // use builder to add reducer
  }
});

export const getInitialState = slice.getInitialState;
export const reducer = slice.reducer;
