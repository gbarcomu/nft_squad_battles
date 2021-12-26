import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import App from "./App";
import CreateQuest from "./routes/CreateQuest";
import CreateSquad from "./routes/CreateSquad";

const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="createquest" element={<CreateQuest />} />
      <Route path="createsquad" element={<CreateSquad />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);