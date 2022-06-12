import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { sideEffectsMiddleware } from './middleware/sideEffects';
import authApi, { authApi as authApiSlice } from './reducers/api/auth.api';
import auth from './reducers/auth';
import main from './reducers/main';
import dialog from './reducers/dialog';
import notices from './reducers/notices';
import wordsApi, { wordsApiSlice } from './reducers/api/words.api';
import words from './reducers/words';

export const store = configureStore({
  reducer: { authApi, main, auth, dialog, notices, wordsApi, words },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat([
      authApiSlice.middleware,
      wordsApiSlice.middleware,
      sideEffectsMiddleware,
    ]),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
