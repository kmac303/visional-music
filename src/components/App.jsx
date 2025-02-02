// import { useState } from 'react';

import './index.css';
import { Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import About from './About';
import Lessons from './Lessons';
import Events from './Events';
import Gallery from './Gallery';
import Contact from './Contact';
import VJGigRequestForm from "./VJGigRequestForm";


function App() {
  // const [count, setCount] = useState(0)

  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/vjgigrequestform" element={<VJGigRequestForm />} />
      </Routes>
    </div>
  )
}

export default App;
