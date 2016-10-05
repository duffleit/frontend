import {getNobt} from 'api/api';
import PersonDebtSummaryFactory from './PersonDebtSummaryFactory'
import CurrencyFormatter from './CurrencyFormatter'
import PersonSummaryFactory from './PersonSummaryFactory'

import debug from 'debug';

const actionNames = {
  LOAD_NOBT: 'Nobt.LOAD_NOBT',
  SET_NOBT: 'Nobt.SET_NOBT',
  CHANGE_TAB: 'Nobt.CHANGE_TAB',
  CHANGE_EXPENSES_VIEW_INFO: 'Nobt.CHANGE_EXPENSES_VIEW_INFO',
};


export const nobtActionFactory = {
  loadNobt: (id) => {
    return (dispatch, getState) => {
      getNobt(id).then(response => {
        dispatch({type: actionNames.SET_NOBT, payload: {nobt: response.data}});
      }, error => {
        //TODO: error handling
      });
    }
  },
  changeTab: (tabName) => ({type: actionNames.CHANGE_TAB, payload: {tabName: tabName}}),
  changeExpenseViewInfo: (filter, sort) => ({type: actionNames.CHANGE_EXPENSES_VIEW_INFO, payload: {filter, sort}}),
};

const actionHandlers = {
  [actionNames.SET_NOBT]: (state, action) => {

    //ioc for the poor
    const currencyFormatter = new CurrencyFormatter("EUR");
    const personSummaryFactory = new PersonSummaryFactory(currencyFormatter);
    const transactionFactory = new PersonDebtSummaryFactory(action.payload.nobt.transactions, personSummaryFactory);

    const total = currencyFormatter.getCurrencyAmount(getTotal(action.payload.nobt.expenses));
    const name = action.payload.nobt.name;
    const members = action.payload.nobt.participatingPersons;
    const expenses = action.payload.nobt.expenses.map(e => getExpense(e, personSummaryFactory));
    const expensesFiltered = expenses;

    var transactions = members.map(m => transactionFactory.computeSummaryForPerson(m));

    return {...state, name, total, members, transactions, expenses, expensesFiltered};
  },
  [actionNames.CHANGE_TAB]: (state, action) => {

    var tabNameIndexMapping = {
      'transactions': 0,
      'expenses': 1
    };

    var tabIndex = tabNameIndexMapping[action.payload.tabName] || 0;

    // TODO this is called often, maybe avoid somehow
    // debug(actionNames.CHANGE_TAB)(`Calculated selected tab index ${tabIndex} from name '${action.payload.tabName}'.`);

    return {...state, tabIndex : tabIndex};
  },
  [actionNames.CHANGE_EXPENSES_VIEW_INFO]: (state, action) => {

    const filter = action.payload.filter;
    const sort = action.payload.sort;

    var expensesFiltered = state.expenses;

    var filterIsNotAll = filter != '';
    if(filterIsNotAll){
      expensesFiltered = expensesFiltered.filter(e =>
        e.debtee.name ==filter ||
        e.debtors.filter(d => d.name ==filter).length > 0
      );
    }

    const sortFunction = {
      "Date": (a,b) => (a.debtee.raw < b.debtee.raw) ? 1 : ((b.debtee.raw < a.debtee.raw) ? -1 : 0),
      "Amount": (a,b) => (a.debtee.raw > b.debtee.raw) ? 1 : ((b.debtee.raw > a.debtee.raw) ? -1 : 0),
    }[sort];

    expensesFiltered = expensesFiltered.sort(sortFunction);

    return {...state, expensesFiltered,  expensesViewInfo: {...state.expensesViewInfo, filter, sort}};
  }
};

const getTotal = (expenses) => {
  return expenses.reduce((total, expense) => total + expense.shares.reduce((expenseTotal, share) => expenseTotal + share.amount, 0), 0);
};

const getExpense = (expense, personSummaryFactory) => {
  const total = expense.shares.reduce((expenseTotal, share) => expenseTotal + share.amount, 0);

  const name = expense.name;
  const strategy = expense.splitStrategy;
  const debtee = personSummaryFactory.cratePersonSummary({name: expense.debtee, amount: total});
  const debtors = expense.shares.map(s => personSummaryFactory.createExpensePerson(s));

  return {name, strategy, debtee, debtors}
};


export const initialState = {
  total: 0,
  name: '',
  member: [],
  tabIndex: 0,
  expensesViewInfo: {filter: "", sort: "Date"}
};

export default function nobtReducer (state = initialState, action) {
  const handler = actionHandlers[action.type]
  return handler ? handler(state, action) : state
}
