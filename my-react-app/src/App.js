import "./App.css";
import DataTable from "./components/HomePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FileUploadForm from './pages/UploadPage';
import ChoosePage from './pages/ChoosePage';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/choose" element={<ChoosePage />} />
          <Route path="/upload" element={<FileUploadForm />} />
          <Route path="/data" element={ <DataTable />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
