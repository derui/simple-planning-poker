---
to: src/status/store.ts
inject: true
skip_if: <%= h.changeCase.camel(name) %>.reducer
after: "const reducers = {"
---
<%= h.changeCase.camel(name) %>: <%= h.changeCase.camel(name) %>.reducer,
