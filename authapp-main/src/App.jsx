import { useEffect, useState } from "react";
import "./App.css";

const CLIENT_ID = "22b888df43076ade070a";
function App() {
  const [rerender, setRerender] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    // blablabla.bla/?code=FAUE2443fhDHFUdsfd99433
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
          <h1>Jesteś zalogowany!</h1>
          <h4>Aby wyświetlić dane z GitHub API  <button onClick={getUserData}>Wyświetl dane dane</button></h4>
          <button onClick={getUserData}>Wyświetl dane dane</button>
          <br />
          {Object.keys(userData).length !== 0 ? (
            <>
              <h4>Witaj {userData.login}</h4>
              <img
                src={userData.avatar_url}
                style={{ width: "200px", height: "200px" }}></img>
              <br />
              <a
                href={userData.html_url}
                style={{ color: "white" }}
                target="_blank">
                Profil GitHub
              </a>
            </>
          ) : (
            <></>
          )}
          <br />
          <button
            onClick={() => {
              localStorage.removeItem("accessToken");
              setRerender(!rerender);
            }}>
            Wyloguj!
          </button>
        </>
      ) : (
        <>
          <h3>Nie jesteś zalogowany! :(</h3>
          <button onClick={loginWithGitHub}>Zaloguj</button>
        </>
      )}
    </div>
  );
}

export default App;
