

import './App.css'; // Importing the styles
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import HomePage from './Pages/HomePage';
import ArtifactCreate from "./Pages/ArtifactCreate";
import ArtifactListing from './Pages/ArtifactListing';
import SearchArtifacts from './Pages/SearchArtifacts';
import ArtifactLevelingList from './Pages/ArtifactLevelingList';


function App() {
  

  

  return (
    
      
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/artifactcreate" element={<ArtifactCreate />} />
          <Route path="/artifact-list" element={<ArtifactListing />} />
          <Route path="/search-artifacts" element={<SearchArtifacts />} />
          <Route path="/leveling-list" element={<ArtifactLevelingList />} />
        </Routes>
      </Router>
      
    
  );
}

export default App;
