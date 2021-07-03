import React, {useState, useContext} from 'react';

const appContext = React.createContext(null)

export const App = () => {
    const [appState, setAppState] = useState({
        user: {name: 'frank', age: 18}
    })

    const contextValue = {appState, setAppState}

    return (
        <appContext.Provider value={contextValue}>
            <大儿子/>
            <二儿子/>
            <幺儿子/>
        </appContext.Provider>
    );
}

const 大儿子 = () => <section>大儿子<User/></section>
const 二儿子 = () => <section>二儿子<Wrapper/></section>
const 幺儿子 = () => <section>幺儿子</section>

const User = () => {
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

const createWrapper = (Component) => {
    const Wrapper = () => {
        const {appState, setAppState} = useContext(appContext);
        const dispatch = (action) => {
            setAppState(reducer(appState, action));
        }

        return <Component dispatch={dispatch} state={appState}/>
    }
    return Wrapper;
}

const UserModifier = ({dispatch, state}) => {
    const onChange = (e) => {
        dispatch({type: 'updateUser', payload: {name: e.target.value}});
    }
    return (
        <div>
            <input value={state.user.name} onChange={onChange}/>
        </div>
    )
}

// 必须先声明了 UserModifier 组件，再把组件作为参数传给 createWrapper 函数
const Wrapper = createWrapper(UserModifier);