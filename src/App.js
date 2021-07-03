import React from 'react';
import {appContext, connect, store} from "./redux";
import {connectToUser} from "./connecters/connectToUser";

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
const 幺儿子 = connect(state => {
    return {group: state.group}
})(({group}) => {
    console.log('幺儿子执行了' + Math.random())
    return <section>幺儿子
        <div>Group:{group.name}</div>
    </section>
})

const User = connectToUser(({user}) => {
    console.log('User执行了' + Math.random())
    return <div>User:{user.name}</div>
})

const UserModifier = connectToUser(({updateUser, user, children}) => {
    const onChange = (e) => {
        updateUser({name: e.target.value});
    }
    return (
        <div>
            {/*children 通过中间组件的 props 透传给实际的组件*/}
            {children}
            <input value={user.name} onChange={onChange}/>
        </div>
    )
});