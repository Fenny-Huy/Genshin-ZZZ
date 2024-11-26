

import './App.css'; // Importing the styles
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ArtifactCreate from "./Pages/ArtifactCreate";
import ArtifactListing from './Pages/ArtifactListing';

function App() {
  

  

  return (
    
      
      <Router>
        <Routes>
          <Route path="/artifactcreate" element={<ArtifactCreate />} />
          <Route path="/artifact-list" element={<ArtifactListing />} />
        </Routes>
      </Router>
      
    
  );
}

export default App;
