// import './App.css';
// import Header from './components/Header';
// import Hero from './components/Hero';
// import Services from './components/Services';
// import Advantages from './components/Advantages'; 
// import About from './components/About';
// import Testimonials from './components/Testimonials';
// import Contact from './components/Contact';
// import Footer from './components/Footer';

// function App() {
//   return (
//     <div className="App">
//       <Header />
//       <main>
//         <Hero />
//         <Services />
//         <Advantages /> 
//         <About /> 
//         <Testimonials /> 
//         <Contact /> 
//       </main>
//       <Footer />
//     </div>
//   );
// }

// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Advantages from './components/Advantages';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Services />
              <Advantages />
              <About />
              <Testimonials />
              <Contact />
            </>
          } />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;