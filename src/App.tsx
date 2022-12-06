import Calculator from "./Components/Calculator";

function App() {
  return (
    <div className="main-container">
      <header>
        <h1>Final Grade Calculator</h1>
      </header>
      <div className="calculator-container">
        <Calculator />
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
  );
}

export default App;
