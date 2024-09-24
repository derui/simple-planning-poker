const registerFeaturePackage = function registerFeaturePackage(plop) {
  plop.setGenerator("feature", {
    description: "skeleton of package for feature",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "name of feature",
      },
    ],
    actions: [
      {
        type: "add",
        path: "features/{{name}}/src/index.ts",
        templateFile: "plop-templates/feature/index.ts.hbs",
      },
      {
        type: "add",
        path: "features/{{name}}/package.json",
        templateFile: "plop-templates/feature/package.json.hbs",
      },
      {
        type: "add",
        path: "features/{{name}}/src/style.css",
        templateFile: "plop-templates/common/style.css.hbs",
      },
      {
        type: "add",
        path: "features/{{name}}/vite.config.js",
        templateFile: "plop-templates/common/vite.config.js.hbs",
      },
      {
        type: "add",
        path: "features/{{name}}/vitest.config.js",
        templateFile: "plop-templates/common/vitest.config.js.hbs",
      },
      {
        type: "add",
        path: "features/{{name}}/eslint.config.js",
        templateFile: "plop-templates/common/eslint.config.js.hbs",
      },
      {
        type: "add",
        path: "features/{{name}}/tsconfig.json",
        templateFile: "plop-templates/common/tsconfig.json.hbs",
      },
      {
        type: "add",
        path: "features/{{name}}/.storybook/main.ts",
        templateFile: "plop-templates/common/storybook/main.ts.hbs",
      },
      {
        type: "add",
        path: "features/{{name}}/.storybook/preview.tsx",
        templateFile: "plop-templates/common/storybook/preview.tsx.hbs",
      },
      {
        type: "add",
        path: "features/{{name}}/tailwind.config.js",
        templateFile: "plop-templates/common/tailwind.config.js.hbs",
      },
    ],
  });
};

const registerAtomToPackage = function registerAtomToPackage(plop) {
  plop.setGenerator("feature-atom", {
    description: "add new atom to feature",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "name of atom",
      },
      {
        type: "input",
        name: "feature",
        message: "name of feature to add atom",
      },
    ],
    actions: [
      {
        type: "add",
        path: "features/{{feature}}/src/atoms/{{name}}.ts",
        templateFile: "plop-templates/feature/atom/atom.ts.hbs",
      },
      {
        type: "append",
        path: "features/{{feature}}/package.json",
        pattern: /\s*"dependencies"\s*:\s*\{/,
        template: '"jotai": "catalog:",',
      },
    ],
  });
};

const registerPresentationalComponentToFeature = function registerPresentationalComponentToFeature(plop) {
  plop.setGenerator("feature-presentation", {
    description: "add new presentational component to feature",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "name of component",
      },
      {
        type: "input",
        name: "feature",
        message: "name of feature to add component",
      },
    ],
    actions: [
      {
        type: "add",
        path: "features/{{feature}}/src/components/presentations/{{name}}.tsx",
        templateFile: "plop-templates/package/ui/component.hbs",
      },
      {
        type: "add",
        path: "features/{{feature}}/src/components/presentations/{{name}}.test.tsx",
        templateFile: "plop-templates/package/ui/component.test.hbs",
      },
      {
        type: "add",
        path: "features/{{feature}}/src/components/presentations/{{name}}.stories.ts",
        templateFile: "plop-templates/package/ui/component.stories.hbs",
      },
    ],
  });
};

const registerSharedLogicPackage = function registerSharedLogicPackage(plop) {
  plop.setGenerator("shared-logic", {
    description: "Skeleton of shared-logic package",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "name of shared logic",
      },
    ],
    actions: [
      {
        type: "add",
        path: "packages/shared-logic/{{name}}/src/index.ts",
        templateFile: "plop-templates/package/shared-logic/index.ts.hbs",
      },
      {
        type: "add",
        path: "packages/shared-logic/{{name}}/package.json",
        templateFile: "plop-templates/package/shared-logic/package.json.hbs",
      },
      {
        type: "add",
        path: "packages/shared-logic/{{name}}/vite.config.js",
        templateFile: "plop-templates/common/vite-non-react.config.js.hbs",
      },
      {
        type: "add",
        path: "packages/shared-logic/{{name}}/vitest.config.js",
        templateFile: "plop-templates/common/vitest-non-react.config.js.hbs",
      },
      {
        type: "add",
        path: "packages/shared-logic/{{name}}/eslint.config.js",
        templateFile: "plop-templates/common/eslint.config.js.hbs",
      },
      {
        type: "add",
        path: "packages/shared-logic/{{name}}/tsconfig.json",
        templateFile: "plop-templates/common/tsconfig.json.hbs",
      },
    ],
  });
};

export default function (plop) {
  // create your generators here
  registerFeaturePackage(plop);
  registerAtomToPackage(plop);
  registerSharedLogicPackage(plop);
  registerPresentationalComponentToFeature(plop);

  plop.setGenerator("simple-ui-component", {
    description: "skeleton of simple UI component package",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "name of component",
      },
    ],
    actions: [
      {
        type: "add",
        path: "packages/ui/{{name}}/src/{{name}}.tsx",
        templateFile: "plop-templates/package/ui/component.hbs",
      },
      {
        type: "add",
        path: "packages/ui/{{name}}/src/style.css",
        templateFile: "plop-templates/common/style.css.hbs",
      },
      {
        type: "add",
        path: "packages/ui/{{name}}/src/{{name}}.test.tsx",
        templateFile: "plop-templates/package/ui/component.test.hbs",
      },
      {
        type: "add",
        path: "packages/ui/{{name}}/src/{{name}}.stories.tsx",
        templateFile: "plop-templates/package/ui/component.stories.hbs",
      },
      {
        type: "add",
        path: "packages/ui/{{name}}/src/index.ts",
        templateFile: "plop-templates/package/ui/index.hbs",
      },
      {
        type: "add",
        path: "packages/ui/{{name}}/package.json",
        templateFile: "plop-templates/package/ui/package.json.hbs",
      },
      {
        type: "add",
        path: "packages/ui/{{name}}/vite.config.js",
        templateFile: "plop-templates/common/vite.config.js.hbs",
      },
      {
        type: "add",
        path: "packages/ui/{{name}}/vitest.config.js",
        templateFile: "plop-templates/common/vitest.config.js.hbs",
      },
      {
        type: "add",
        path: "packages/ui/{{name}}/eslint.config.js",
        templateFile: "plop-templates/common/eslint.config.js.hbs",
      },
      {
        type: "add",
        path: "packages/ui/{{name}}/tsconfig.json",
        templateFile: "plop-templates/common/tsconfig.json.hbs",
      },
      {
        type: "add",
        path: "packages/ui/{{name}}/.storybook/main.ts",
        templateFile: "plop-templates/common/storybook/main.ts.hbs",
      },
      {
        type: "add",
        path: "packages/ui/{{name}}/.storybook/preview.tsx",
        templateFile: "plop-templates/common/storybook/preview.tsx.hbs",
      },
      {
        type: "add",
        path: "packages/ui/{{name}}/tailwind.config.js",
        templateFile: "plop-templates/common/tailwind.config.js.hbs",
      },
    ],
  });
}
