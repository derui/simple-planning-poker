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
        path: "features/{{name}}/.storybook/preview.ts",
        templateFile: "plop-templates/common/storybook/preview.ts.hbs",
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
    ],
  });
};

export default function (plop) {
  // create your generators here
  registerFeaturePackage(plop);
  registerAtomToPackage(plop);

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
        templateFile: "plop-templates/ui/component.hbs",
      },
      {
        type: "add",
        path: "packages/ui/{{name}}/src/style.css",
        templateFile: "plop-templates/common/style.css.hbs",
      },
      {
        type: "add",
        path: "packages/ui/{{name}}/src/{{name}}.test.tsx",
        templateFile: "plop-templates/ui/component.test.hbs",
      },
      {
        type: "add",
        path: "packages/ui/{{name}}/src/{{name}}.stories.tsx",
        templateFile: "plop-templates/ui/component.stories.hbs",
      },
      {
        type: "add",
        path: "packages/ui/{{name}}/src/index.ts",
        templateFile: "plop-templates/ui/index.hbs",
      },
      {
        type: "add",
        path: "packages/ui/{{name}}/package.json",
        templateFile: "plop-templates/ui/package.json.hbs",
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
        path: "packages/ui/{{name}}/.storybook/preview.ts",
        templateFile: "plop-templates/common/storybook/preview.ts.hbs",
      },
      {
        type: "add",
        path: "packages/ui/{{name}}/tailwind.config.js",
        templateFile: "plop-templates/common/tailwind.config.js.hbs",
      },
    ],
  });
}
