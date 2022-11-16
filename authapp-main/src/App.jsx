import { useEffect, useState } from "react";
import github from "../src/img/github.svg";

import "./App.css";

const CLIENT_ID = "";
function App() {
  const [rerender, setRerender] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");
    console.log("github code: ", codeParam);

    console.log("local storage token: ", localStorage.getItem("accessToken"));
    if (codeParam && localStorage.getItem("accessToken") === null) {
      async function getAccessToken() {
        await fetch(`http://localhost:8080/getAccessToken?code=${codeParam}`, {
          method: "GET",
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            console.log("response data: ", data);
            if (data.access_token) {
              console.log("token from response: ", data.access_token);
              localStorage.setItem("accessToken", data.access_token);
              setRerender(!rerender);
            }
          });
      }
      getAccessToken();
    }
  }, []);

  async function getUserData() {
    await fetch("http://localhost:8080/getUserData", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setUserData(data);
      });
  }

  function loginWithGitHub() {
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`
    );
  }

  return (
    <div className="App">
      {localStorage.getItem("accessToken") ? (
        <>
          <h1>Logowanie poprawne</h1>
          <h4>Aby wyświetlić dane z GitHub API </h4>
          <button onClick={getUserData}>Wyświetl dane dane</button>
          <br />

          {Object.keys(userData).length !== 0 ? (
            <>
              <h4>Witaj {userData.name}</h4>
              <img
                src={userData.avatar_url}
                style={{ width: "200px", height: "200px" }}
              ></img>
              <h4>Login: {userData.login}</h4>
              <br />
              <h4>Liczba publicznych repozytoriów: {userData.public_repos}</h4>
              <br />
              <button>
                <a
                  href={userData.html_url}
                  style={{ color: "white" }}
                  target="_blank"
                >
                  Profil GitHub
                </a>
              </button>
              <br />
            </>
          ) : (
            <></>
          )}
          <br />
          <button
            onClick={() => {
              localStorage.removeItem("accessToken");
              setRerender(!rerender);
            }}
          >
            Wyloguj!
          </button>
        </>
      ) : (
        <>
          <div className="login">
            <div className="lContainer">
              <input
                type="text"
                placeholder="username"
                id="username"
                className="lInput"
              />
              <input
                type="password"
                placeholder="password"
                id="password"
                className="lInput"
              />
              <button className="lButton">Login</button>
              <btton onClick={loginWithGitHub} className="Button">
                Zaloguj się przez
                <img src={github} alt="GitHub Logo" />
              </btton>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
