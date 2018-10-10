import React from "react";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  spotifyLogin() {
    fetch(
      "https://accounts.spotify.com/authorize?client_id=e6723e026ea24e958ddb995bf8ce0c4c&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A5000%2Fauthorize_success&scope=user-library-read+user-modify-playback-state",
      { mode: "no-cors" }
    ).then(data => data);
  }

  componentDidMount() {
    this.spotifyLogin();
  }

  render() {
    return <div className="App">test </div>;
  }
}

export default Login;
