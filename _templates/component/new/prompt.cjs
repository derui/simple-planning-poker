// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
//
module.exports = [
  {
    type: 'select',
    name: 'type',
    message: 'select component type',
    choices: ['atoms', 'molecules', 'organisms', 'containers']
  },
  {
    type: 'input',
    name: 'name',
    message: "input component name",
    validate: (v) => v !== ''
  }
]
