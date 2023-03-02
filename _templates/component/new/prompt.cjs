// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
//
module.exports = [
  {
    type: 'select',
    name: 'type',
    message: 'select component type',
    choices: ['presentations', 'containers', 'pages']
  },
  {
    type: 'input',
    name: 'name',
    message: "input component name",
    validate: (v) => v !== ''
  }
]
