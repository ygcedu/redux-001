import React, {useState, useContext, useMemo} from 'react';

const appContext = React.createContext(null)

export const App = () => {
    const [appState, setAppState] = useState({
        user: {name: 'frank', age: 18}
    })

    const x = useMemo(()=>{return <幺儿子/>},[])// 空数组表示，只执行一次

    const contextValue = {appState, setAppState}

    return (
        <appContext.Provider value={contextValue}>
            <大儿子/>
            <二儿子/>
            {x}
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
    const contextValue = useContext(appContext);
    return <div>User:{contextValue.appState.user.name}</div>
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
        const {appState, setAppState} = useContext(appContext);
        const dispatch = (action) => {
            setAppState(reducer(appState, action));
        }

        return <Component {...props} dispatch={dispatch} state={appState}/>
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