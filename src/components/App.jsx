import './index.css';
import { Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import NavBar from './NavBar';
import Home from './Home';
import Lessons from './Lessons';
import AudioBackground from './AudioBackground';
import HudBar from './HudBar';


function App() {

  return (
    // Scroll-in animations are skipped for visitors who turned on reduced motion
    <MotionConfig reducedMotion="user">
      <AudioBackground>
        <NavBar />
        <Routes>
          {/* One scrolling page; the section paths scroll to their section */}
          {["/", "/about", "/events", "/gallery", "/contact"].map((path) => (
            <Route key={path} path={path} element={<Home />} />
          ))}
          <Route path="/lessons" element={<Lessons />} />
        </Routes>
        <HudBar />
      </AudioBackground>
    </MotionConfig>
  )
}

export default App;
