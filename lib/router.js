const debugFactory = require('@superhero/debug');
module.exports = (bus, routes, log = false) =>
{
  // logger for debugging
  const debug = debugFactory({debug:log});

  // using a context loop to be able to build the dispatcher chain
  // independently on eac level
  (function walker(collection, dispatchers, i = 0)
  {
    // exit when end of the row has been reashed
    if(i == collection.length)
      return;

    // cloning the array to preserve scope
    dispatchers = dispatchers.slice(0);

    // build all lower level first..
    walker(collection, dispatchers, i+1);

    // extend dispatchers from the former levels to be used in this level and
    // all children..
    collection[i].dispatchers
    && dispatchers.push(...collection[i].dispatchers);

    // build next level
    collection[i].children
    && walker(collection[i].children, dispatchers);

    // attach event
    collection[i].name
    && bus.on(collection[i].name, (...args) =>
    {
      debug(`triggered: "${collection[i].name}" dispatchers: "${dispatchers}"`);
      try
      {
        // loop through all dispatchers in an ordered fashion
        dispatchers.forEach((dispatcher) =>
        {
          debug(`dispatching: "${dispatcher}"`);
          require(dispatcher)(...args);
        });
      }
      catch(e)
      {
        debug(`dispatcher threw an exception`);

        // if a dispatcher throws an event, disrupt the dispatcher loop and
        // emit the event that was thrown
        if(e instanceof Object && 'name' in e && 'context' in e)
          bus.emit(e.name, e.context);

        // throw anything, but not nothing. Making it possible to disrupt the
        // loop by throwing null, undefined, false or 0 or what ever..
        else if(e)
          throw e;
      }
    });
  })(routes, []);
};
