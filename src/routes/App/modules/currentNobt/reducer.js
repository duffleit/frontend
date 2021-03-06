import { UPDATE_FETCH_NOBT_STATUS, ADD_MEMBER, INVALIDATE_NOBT } from "./actions";
import AsyncActionStatus from "const/AsyncActionStatus";
import _debug from "debug";

const updateFetchNobtStatusActionPayloadHandler = {
  [AsyncActionStatus.IN_PROGRESS]: () => {},
  [AsyncActionStatus.SUCCESSFUL]: (payload) => (
    {
      data: {
        id: payload.nobt.id,
        name: payload.nobt.name,
        currency: payload.nobt.currency,
        participatingPersons: payload.nobt.participatingPersons,
        transactions: payload.nobt.transactions,
        bills: payload.nobt.expenses,
        createdOn: payload.nobt.createdOn
      }
    }
  ),
  [AsyncActionStatus.FAILED]: () => {},
  [null]: () => {}
};

const handlers = {
  [UPDATE_FETCH_NOBT_STATUS]: (state, action) => {
    let newState = updateFetchNobtStatusActionPayloadHandler[ action.payload.status ](action.payload);

    return {
      ...state,
      ...newState,
      nobtFetchTimestamp: Date.now(),
      fetchNobtStatus: action.payload.status
    }
  },

  [ADD_MEMBER]: (state, action) => {

    let currentMembers = state.data.participatingPersons;
    let memberToAdd = action.payload.name;

    if (currentMembers.find(name => name === memberToAdd) !== undefined) {
      _debug(ADD_MEMBER)(`Person with name '${memberToAdd}' already exists.`);
      return state;
    }

    let newData = {
      ...state.data,
      participatingPersons: [ ...currentMembers, memberToAdd ]
    };

    return {...state, data: newData}
  },

  [INVALIDATE_NOBT]: (state, action) => {

    return {
      ...state,
      nobtFetchTimestamp: null
    }
  },
};

const initialState = {
  fetchNobtStatus: null,
  nobtFetchTimestamp: null,
  data: {
    id: "",
    name: "",
    currency: "",
    participatingPersons: [], // TODO rename to members
    transactions: [],
    bills: [],
  }
};

export default function currentNobt(state = initialState, action) {
  const handler = handlers[ action.type ];
  return handler ? handler(state, action) : state;
}
