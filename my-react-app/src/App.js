import "./App.css";
import DataTable from "./components/HomePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FileUploadForm from './pages/UploadPage';
import ChoosePage from './pages/ChoosePage';
import NavBAR from "./components/navbar";
import Footer from "./components/footer";

function App() {
  return (
    <div className="App">
      <Router>
        <NavBAR />
        <Routes>
          <Route path="/choose" element={<ChoosePage />} />
          <Route path="/upload" element={<FileUploadForm />} />
          <Route path="/data" element={ <DataTable />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
