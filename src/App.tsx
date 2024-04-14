import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Calendar from "./components/Calendar/Calendar";

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        {/* Other components or content */}
        <Calendar />
      </header>
    </div>
  );
};

export default App;
