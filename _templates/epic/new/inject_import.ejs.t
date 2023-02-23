---
to: src/status/store.ts
inject: true
skip_if: <%= h.changeCase.camel(name) %>Epic
after: "// INJECT EPIC IMPORT HERE"
---
import { <%= h.changeCase.camel(name) %>Epic } from './epics/<%= name %>';
