import { createStore, combineReducers } from 'redux'
// redux持久化
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import CollApsedReducer from './reducers/CollapseReducer'
import LoadingReducer from './reducers/LoadingReducer'

const persistConfig = {
    // 存放的key值
    key: 'collapsed',
    // 存在localStorage中
    storage,
    // 黑名单，就是不将哪个reducer放入storage中
    blackList:['LoadingReducer']

}

const reducer = combineReducers({
    CollApsedReducer,
    LoadingReducer
})

const persistedReducer = persistReducer(persistConfig, reducer)
const store = createStore(persistedReducer)
const persistor = persistStore(store)

export {
    store,
    persistor
}