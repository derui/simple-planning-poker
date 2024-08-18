export default function (plop) {
    // create your generators here
    plop.setGenerator('simple-ui-component', {
        description: 'skeleton of simple UI component package',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'name of component'
            }
        ],
        actions: [
            {
                type: 'add',
                path: 'packages/ui/{{name}}/src/{{name}}.tsx',
                templateFile: 'plop-templates/ui/component.hbs',
            },
            {
                type: 'add',
                path: 'packages/ui/{{name}}/src/style.css',
                templateFile: 'plop-templates/ui/style.css.hbs',
            },
            {
                type: 'add',
                path: 'packages/ui/{{name}}/src/{{name}}.test.tsx',
                templateFile: 'plop-templates/ui/component.test.hbs'
            },
            {
                type: 'add',
                path: 'packages/ui/{{name}}/src/{{name}}.stories.tsx',
                templateFile: 'plop-templates/ui/component.stories.hbs'
            },
            {
                type: 'add',
                path: 'packages/ui/{{name}}/src/index.ts',
                templateFile: 'plop-templates/ui/index.hbs'
            },
            {
                type: 'add',
                path: 'packages/ui/{{name}}/package.json',
                templateFile: 'plop-templates/ui/package.json.hbs'
            },
            {
                type: 'add',
                path: 'packages/ui/{{name}}/vite.config.js',
                templateFile: 'plop-templates/ui/vite.config.js.hbs'
            },
            {
                type: 'add',
                path: 'packages/ui/{{name}}/vitest.config.js',
                templateFile: 'plop-templates/ui/vitest.config.js.hbs'
            },
            {
                type: 'add',
                path: 'packages/ui/{{name}}/eslint.config.js',
                templateFile: 'plop-templates/ui/eslint.config.js.hbs'
            },
            {
                type: 'add',
                path: 'packages/ui/{{name}}/tsconfig.json',
                templateFile: 'plop-templates/ui/tsconfig.json.hbs'
            },
            {
                type: 'add',
                path: 'packages/ui/{{name}}/.storybook/main.ts',
                templateFile: 'plop-templates/ui/storybook/main.ts.hbs'
            },
            {
                type: 'add',
                path: 'packages/ui/{{name}}/.storybook/preview.ts',
                templateFile: 'plop-templates/ui/storybook/preview.ts.hbs'
            },
            {
                type: 'add',
                path: 'packages/ui/{{name}}/tailwind.config.js',
                templateFile: 'plop-templates/ui/tailwind.config.js.hbs'
            },
        ]
    });
};
