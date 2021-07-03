import React, {useState, useContext, useEffect} from 'react';

export const store = {
    state: {
        user: {name: 'frank', age: 18}
    },
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

const reducer = (state, {type, payload}) => {
    if (type === 'updateUser') {
        return {
            ...state,
            user: {
                ...state.user,
                ...payload
            }
        }
    } else {
        return state
    }
}

export const connect = (selector) => (Component) => {
    return (props) => {
        const {state, setState} = useContext(appContext);
        // 这里只需要写数据，用于通知React更新UI
        const [, update] = useState({})
        // 如果selector参数赋值了，则执行selector函数，如果没有则还用全局的state
        const data = selector ? selector(state) : {state};
        useEffect(() => {
            store.subscribe(() => {
                // 传一个新的对象{}, 是什么无所谓，这里只要地址变了就行
                update({})
            })
        }, [])// 只订阅一次
        const dispatch = (action) => {
            setState(reducer(state, action));
        }

        return <Component {...props} {...data} dispatch={dispatch}/>
    }
}

export const appContext = React.createContext(null)