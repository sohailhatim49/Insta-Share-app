import "./index.css";
import { Component } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Cookies from 'js-cookie'

class LoginForm extends Component {
  state = { username: "", password: "", showError:false, errorMsg:"" };
  onChangeUsername = (event) => {
    this.setState({ username: event.target.value });
  };
  onChangePassword = (event) => {
    this.setState({ password: event.target.value });
  };

  onsubmitSuccess = (jwtToken) => {
    const { navigate } = this.props;
    Cookies.set('jwt_token',jwtToken,{expires:30})
    navigate("/",{ replace: true });
  };

  onSubmitFailure=(errorMsg)=>{
    this.setState({showError:true,errorMsg})
  }

  onSubmitLogin = async (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    const url = "https://apis.ccbp.in/login";
    const options = {
      method: "POST",
      body: JSON.stringify({ username, password }),
    };
    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok === true) {
      this.onsubmitSuccess(data.jwt_token);
    }
    else{
      this.onSubmitFailure(data.error_msg)
    }
  };

  render() {
    const {showError,errorMsg}=this.state
    const jwtToken=Cookies.get('jwt_token')
    if(jwtToken!==undefined){
      return <Navigate to="/" replace />;
    }
    return (
      <div className="login-wrapper">
        <img
          src="https://cdn.prod.website-files.com/687dfa6a74652a7bc2b6b2a5/68983b0d724b5a03e47edcd6_Illustration.png"
          alt="website login"
          className="login-image"
        />

        <div className="login-form-wrapper">
          <div className="form-logo-wrapper">
            <img
              src="https://cdn.prod.website-files.com/687dfa6a74652a7bc2b6b2a5/68983b6f04eeea2152df28df_logo.png"
              alt="website logo"
              className="login-logo"
            />
            <p className="logo-text">Insta Share</p>
          </div>

          <form className="login-form" onSubmit={this.onSubmitLogin}>
            <div className="form-input-wrapper">
              <label className="input-label" labelFor="username">
                USERNAME
              </label>
              
              <input
                id="username"
                type="text"
                required
                className="form-input"
                onChange={this.onChangeUsername}
              />
            </div>
            <div className="form-input-wrapper">
              <label className="input-label" labelFor="password">
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                required
                className="form-input"
                onChange={this.onChangePassword}
              />
              {showError && <p className="error-message">{errorMsg}</p>}
            </div>
            <button className="form-button" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }
}

function Login(props) {
  const navigate = useNavigate();
  return <LoginForm {...props} navigate={navigate} />;
}

export default Login;
