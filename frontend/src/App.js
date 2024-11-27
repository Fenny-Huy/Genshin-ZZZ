

import './App.css'; // Importing the styles
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import HomePage from './Pages/HomePage';
import ArtifactCreate from "./Pages/ArtifactCreate";
import ArtifactListing from './Pages/ArtifactListing';


function App() {
  

  

  return (
    
      
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/artifactcreate" element={<ArtifactCreate />} />
          <Route path="/artifact-list" element={<ArtifactListing />} />
        </Routes>
      </Router>
      
    
  );
}

export default App;
