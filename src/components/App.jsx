
import './index.css';
import { Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import About from './About';
import Lessons from './Lessons';
import Events from './Events';
import Gallery from './Gallery';
import Contact from './Contact';
import VJGigRequestForm from "./VJGigRequestForm";
import VJLessonRequestForm from "./VJLessonRequestForm";


function App() {

  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/vjrequest" element={<VJGigRequestForm />} />
        <Route path="/lessonrequest" element={<VJLessonRequestForm />} />
      </Routes>
    </div>
  )
}

export default App;
