import { useContext, useEffect } from "react";
import Auth from "./Components/Auth";
import Calculator from "./Components/CalculatorLayout";
import { AuthContext } from "./Components/Auth/AuthProvider";
import { baseUrl } from "./utils/config";

function App() {
  const { auth, setAuth } = useContext(AuthContext);
  useEffect(() => {
    (async () => {
      const res = await fetch(`${baseUrl}/auth/user-info`, {
        credentials: "include",
      });
      if (res.status === 200) {
        setAuth({ isLoggedIn: true, email: (await res.json()).email });
      }
    })();
  }, []);
  return (
    <>
      <div className="main-container">
        <header>
          <h1>Final Grade Calculator</h1>
        </header>
        <div className="calculator-container">
          {auth.isLoggedIn ? <Calculator /> : <Auth />}
        </div>
        <footer>
          <div>
            <p>
              Made By{" "}
              <a href="https://willma.me" target={"_blank"} rel={"noreferrer"}>
                Willma
              </a>
            </p>
          </div>
          <div>
            <p className="copyright">
              Copyright © {new Date().getFullYear()} Willma. All Rights Reserved
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
