import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Catalog from './pages/Catalog/Catalog';
import CamperDetail from './pages/CamperDetail/CamperDetail';
import Favorits from './pages/Favorits/Favorits';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:id" element={<CamperDetail />} />
          <Route path="/favorits" element={<Favorits />} />
        </Routes>
      </main>
      <ToastContainer />
    </div>
  );
}

export default App;
