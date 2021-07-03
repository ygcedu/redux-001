import React, {useState, useContext, useEffect} from 'react';

const appContext = React.createContext(null)

const store = {
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

export const App = () => {
    return (
        <appContext.Provider value={store}>
            <大儿子/>
            <二儿子/>
            <幺儿子/>
        </appContext.Provider>
    );
}

const 大儿子 = () => {
    console.log('大儿子执行了' + Math.random())
    return <section>大儿子<User/></section>
}
const 二儿子 = () => {
    console.log('二儿子执行了' + Math.random())
    return <section>二儿子<UserModifier x={'x'}>内容</UserModifier></section>
}
const 幺儿子 = () => {
    console.log('幺儿子执行了' + Math.random())
    return <section>幺儿子</section>
}

const User = () => {
    console.log('User执行了' + Math.random())
    const {state} = useContext(appContext);
    return <div>User:{state.user.name}</div>
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

const connect = (Component) => {
    return (props) => {
        const {state, setState} = useContext(appContext);
        // 这里只需要写数据，用于通知React更新UI
        const [, update] = useState({})
        useEffect(() => {
            store.subscribe(() => {
                // 传一个新的对象{}, 是什么无所谓，这里只要地址变了就行
                update({})
            })
        }, [])// 只订阅一次
        const dispatch = (action) => {
            setState(reducer(state, action));
        }

        return <Component {...props} dispatch={dispatch} state={state}/>
    }
}

const UserModifier = connect(({dispatch, state, children}) => {
    const onChange = (e) => {
        dispatch({type: 'updateUser', payload: {name: e.target.value}});
    }
    return (
        <div>
            {/*children 通过中间组件的 props 透传给实际的组件*/}
            {children}
            <input value={state.user.name} onChange={onChange}/>
        </div>
    )
});