---
to: src/status/store.ts
inject: true
skip_if: <%= h.changeCase.camel(name) %>Epic(registrar)
after: "const rootEpics = \\["
---
...Object.values(<%= h.changeCase.camel(name) %>Epic(registrar)),
