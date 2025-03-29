import "./App.css";
import Demo from './assets/components/front1';
import Hero from "./assets/components/front2";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <main>
        <div className="main">
          <div className="gradient" />
        </div>
        <div className="app">
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <Demo />
              </>
            } />
            
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  );
};

export default App;
