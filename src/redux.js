import React, {useState, useContext, useEffect} from 'react';

const store = {
    state: undefined,
    reducer: undefined,
    setState(newState) {
        store.state = newState
        store.listeners.map(fn => fn(store.state))
    },
    listeners: [],
    subscribe(fn) {
        store.listeners.push(fn);
        return () => {
            const index = store.listeners.indexOf(fn)
            store.listeners.splice(index, 1)
        }
    }
}

export const createStore = (reducer, initState) => {
    store.state = initState
    store.reducer = reducer
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
        const dispatch = (action) => {
            setState(store.reducer(state, action));
        }
        // const {state, setState} = useContext(appContext);
        // 可以改从store拿，不用从useContext拿
        const {state, setState} = store;
        // 这里只需要写数据，用于通知React更新UI
        const [, update] = useState({})
        // 如果selector参数赋值了，则执行selector函数，如果没有则还用全局的state
        const data = selector ? selector(state) : {state};
        const dispatchers = dispatcherSelector ? dispatcherSelector(dispatch) : {dispatch}
        // 订阅store数据，数据一变化就触发更新
        useEffect(() => store.subscribe(() => {
            const newData = selector ? selector(store.state) : {state: store.state};
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