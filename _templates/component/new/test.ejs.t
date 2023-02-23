---
to: src/components/<%= type %>/<%= name %>.test.tsx
---
import {test, expect, afterEach} from 'vitest';
import {render, screen, cleanup, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

<%
  splittedNames = name.split('/');
  componentName = splittedNames[splittedNames.length - 1];
%>

import { <%= h.changeCase.pascal(componentName) %> } from './<%= name %>';

afterEach(cleanup);

test("should be able to render", () => {
  render(<<%= h.changeCase.pascal(componentName) %> />);
});
