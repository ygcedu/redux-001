import React, {useState, useContext, useEffect} from 'react';

let state = undefined
let reducer = undefined
let listeners = []

const setState = (newState) => {
    state = newState
    listeners.map(fn => fn(state))
}

const store = {
    getState() {
        return state;
    },
    dispatch: (action) => {
        setState(reducer(state, action));
    },
    subscribe(fn) {
        listeners.push(fn);
        return () => {
            const index = listeners.indexOf(fn)
            listeners.splice(index, 1)
        }
    },
    replaceReducer(newReducer) {
        reducer = newReducer
    }
}

const dispatch = store.dispatch

export const createStore = (_reducer, initState) => {
    state = initState
    reducer = _reducer
    return store;
}

// 比较新旧数据有没有变化
const changed = (oldState, newState) => {
    let changed = false;
    for (let key in oldState) {
        if (oldState[key] !== newState[key]) {
            changed = true;
        }
    }
    return changed;
}

export const connect = (selector, dispatcherSelector) => (Component) => {
    return (props) => {
        // 如果selector参数赋值了，则执行selector函数，如果没有则还用全局的state
        const data = selector ? selector(state) : {state};
        const dispatchers = dispatcherSelector ? dispatcherSelector(dispatch) : {dispatch}
        // 这里只需要写数据，用于通知React更新UI
        const [, update] = useState({})
        // 订阅store数据，数据一变化就触发更新
        useEffect(() => store.subscribe(() => {
            const newData = selector ? selector(state) : {state};
            if (changed(data, newData)) {
                console.log('update')
                // 传一个新的对象{}, 是什么无所谓，这里只要地址变了就行
                update({});
            }
        }), [selector])

        return <Component {...props} {...data} {...dispatchers}/>
    }
}

export const appContext = React.createContext(null)

export const Provider = ({store, children}) => {
    return (
        <appContext.Provider value={store}>
            {children}
        </appContext.Provider>
    )
}