import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogIn from './pages/LogIn';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/email-verify" element={<VerifyEmail />} />
          <Route path="/home" element={<Home/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
