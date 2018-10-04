import React from 'react'

class Login extends React.Component {
    constructor() {
        super();
        this.state = {}
    }

    spotifyLogin() {
        fetch('http://127.0.0.1:5000/authorize/', {redirect: 'follow'}).then( data =>
        console.log(data))
    }

    componentDidMount() {
        this.spotifyLogin()
    }

    render() {
        return <div className="App">test </div>
    }
}

export default Login