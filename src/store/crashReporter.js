export const crashReporter = store => next => action => {

  if (!Raven || !Raven.isSetup()) {
    return next(action);
  }

  try {
    Raven.captureBreadcrumb({
      category: "redux",
      message: action.type
    });

    return next(action); // dispatch
  } catch (err) {
    Raven.captureException(err, { // send to crash reporting tool
      extra: {
        action,
        state: store.getState() // dump application state
      }
    });
    throw err; // re-throw error
  };
};