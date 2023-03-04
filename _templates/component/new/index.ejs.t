---
to: src/components/<%= type %>/<%= name %>.tsx
---
import classNames from 'classnames';

export interface Props {
  // need Property definition
}

<%
  splittedNames = name.split('/');
  componentName = splittedNames[splittedNames.length - 1];
%>

// eslint-disable-next-line func-style
export function <%= h.changeCase.pascal(componentName) %>(props: Props) {
  return <span>need implementation</span>
};
