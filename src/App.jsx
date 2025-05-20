import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from  './components/Footer';
import Home from './components/Home';
import Projects from './components/Project';
import ProjectForm from './components/ProjectForm';
import Locations from './components/Location';
import LocationFrom from './components/LocationForm';
import Preview from './components/Preview';

/**
 * Run the whole app 
 * @returns App component
 */
function App() {
  const navLinks = [
    { path: "/project", text: "PROJECTS" }
  ];

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header brandText="STORYPATH" navLinks={navLinks} />

        <div className='container pt-4 flex-grow'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project" element={<Projects />} />
            <Route path="/newProject" element={<ProjectForm />} />
            <Route path="/editProject/:id" element={<ProjectForm />} />
            <Route path="/location/:project_id" element={<Locations />} />
            <Route path="/newLocation/:project_id" element={<LocationFrom />} />
            <Route path="/editLocation/:project_id/:id" element={<LocationFrom />} />
            <Route path="/preview/:project_id" element={<Preview />} />
          </Routes>

        </div>
        
        <Footer />
      </div>
    </Router>
  );
  
}

export default App;
