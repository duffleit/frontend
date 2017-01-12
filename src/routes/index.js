// We only need to import the modules necessary for initial render
import CoreLayout from "../layouts/CoreLayout/CoreLayout";

import Landing from "./Landing";
import { injectReducer } from "../store/reducers";

import Nobt from "./App/routes/Nobt";
import NewNobt from "./App/routes/NewNobt";
import reducer from "./App/reducers";

/*  Note: Instead of using JSX, we recommend using react-router
 PlainRoute objects to build route definitions.   */

export const createRoutes = (store) => {

  injectReducer(store, {key: 'App', reducer});

  return {
    path: '/',
    component: CoreLayout,
    indexRoute: Landing,
    childRoutes: [
      Nobt,
      NewNobt
    ]
  }
}

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default createRoutes
