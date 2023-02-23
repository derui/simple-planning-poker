---
to: src/status/store.ts
inject: true
skip_if: <%= h.changeCase.camel(name) %>
after: "// INJECT REDUCER IMPORT HERE"
---
import * as <%= h.changeCase.camel(name) %> from './slices/<%= name %>';
