import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './slices/authSlice';
import taskReducer from './slices/taskSlice';
import categoryReducer from './slices/categorySlice';
import statusReducer from './slices/statusSlice';
import uiReducer from './slices/uiSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    tasks: taskReducer,
    categories: categoryReducer,
    statuses: statusReducer,
    ui: uiReducer,
});

const persistConfig = {
    key: 'myplanner',
    storage,
    whitelist: ['auth', 'ui'], // Only persist auth & UI state; tasks/categories/statuses re-fetched from API
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
