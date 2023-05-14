const yaml = require('js-yaml');
const diff = require('deep-diff');

const yaml1 = `
name: Alice
age: 30
address:
  street: 123 Main St
  city: Anytown
`;

const yaml2 = `
name: Alice
age: 31
address:
  street: 123 Main St
  city: Anytown
  state: CA
`;

const obj1 = yaml.load(yaml1);
const obj2 = yaml.load(yaml2);

const differences = diff(obj1, obj2);

console.log(differences);
