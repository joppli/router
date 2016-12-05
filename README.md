# Router

Licence: [MIT](https://opensource.org/licenses/MIT).

---

[![npm version](https://badge.fury.io/js/%40superhero%2Frouter.svg)](https://badge.fury.io/js/%40superhero%2Frouter)

A router that offers an hierarchy of dispatchers to an event bus.  

## Install

`npm install @superhero/router`

...or just set the dependency in your `package.json` file:

```json
{
  "dependencies":
  {
    "@superhero/router": "*"
  }
}
```

## Example

```javascript
'use strict';

const
EventBus  = require('events');
bus       = new EventBus(),
debugging = true,
routes    =
[
  {
    name        :  'authentication',
    dispatchers : ['api/authentication']
  },
  {
    name        :  'authorization',
    dispatchers : ['api/authorization']
  },
  {
    name        :  'unauthorize',
    dispatchers : ['api/unauthorize']
  },
  {
    dispatchers : ['api/authorize'],
    children    :
    [
      {
        name        :  'foo',
        dispatchers : ['api/foo']
      },
      {
        name        :  'bar',
        dispatchers : ['api/bar']
      }
    ]
  }
];

require('@superhero/router')(bus, routes, debugging);
```

A dispatcher can break the dispatcher loop by throwing an object with the attributes `name` and `context`, which will be triggered as an event, or throw "nothing" (eg: false, 0, undefined...).
