import React from 'react';
import {appContext, connect, store} from "./redux";

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

const User = connect( ({state, dispatch}) => {
    console.log('User执行了' + Math.random())
    return <div>User:{state.user.name}</div>
})

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