'use strict';

// an immutable object that can be used when throwing an event to disrupt
// the current dispatcher chain. @see router.js
module.exports = (name, context) => new class
{
  get name()
  {
    return name;
  }

  get context()
  {
    return context;
  }
}
