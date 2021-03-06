import withNobtLoader from "../../components/hoc/withNobtLoader";
import NobtContainer from "./containers/NobtContainer";
import NewBillRoute from "./routes/new";
import DetailRoute from "./routes/id";
import SortOverlayRoute from "./routes/sort";
import FilterOverlayRoute from "./routes/filter";
import BalancesRoute from "./routes/balances";
import reducer from "./modules/reducers";
import { injectReducer } from "../../store/reducers";
import EmptyLayout from "../../layouts/EmptyLayout";

export default (store) => {

  injectReducer(store, {key: 'App', reducer});

  return {
    path: ':nobtId',
    component: withNobtLoader(EmptyLayout),
    indexRoute: {
      component: NobtContainer
    },
    childRoutes: [
      NewBillRoute,
      BalancesRoute,
      SortOverlayRoute,
      FilterOverlayRoute,
      DetailRoute,
    ]
  }
}
