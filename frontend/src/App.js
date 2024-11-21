

import './App.css'; // Importing the styles
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ArtifactCreate from "./Pages/ArtifactCreate";

function App() {
  

  

  return (
    <div className="container">
      
      <Router>
        <Routes>
          <Route path="/artifactcreate" element={<ArtifactCreate />} />
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;
