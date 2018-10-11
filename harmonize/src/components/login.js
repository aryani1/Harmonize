import React from "react";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  spotifyLogin() {
    // TODO endre redirect_uri fra localhost til prod
    const redirectUrl = "harmonize-app.herokuapp.com/authorize_success"
    fetch(
      `https://accounts.spotify.com/authorize?client_id=e6723e026ea24e958ddb995bf8ce0c4c&response_type=code&redirect_uri=${redirectUrl}&scope=user-library-read+user-modify-playback-state`,
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
