import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {user, login, logout } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <form className="row g-3" onSubmit={handleSubmit}>
  <div className="col-md-3">
    <input type="text" className="form-control" id="inputEmail4" placeholder="Name" onChange={(e) => setUsername(e.target.value)} />
  </div>
  <div className="col-md-3">
    <input type="password" className="form-control" id="inputPassword4"  onChange={(e) => setPassword(e.target.value)}/>
  </div>
  <div className="col-md-3">
  {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button type="submit" className="btn btn-primary">Login</button>
  )}
  </div>
  </form>

  );
};

export default Login;
