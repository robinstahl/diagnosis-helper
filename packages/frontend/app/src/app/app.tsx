import { Route, Routes, Link } from 'react-router-dom';
import './app.scss';
import DiagnosisHelper from './views/DiagnosisHelper/DiagnosisHelper';
import AIArena from './views/AiArena/AiArena';
import Button from './components/Button/Button';
import DiagnosisHelperSVG from '../assets/DiagnosisHelper.svg';

export function App() {
  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={
            <div className="centered-content">
              <div className="svg-container">
                <img src={DiagnosisHelperSVG} alt="Diagnosis Helper" />
              </div>
              <div className="centered-buttons">
                <Link to="/ai-arena">
                  <Button styleType={'primary'} text={'AI Arena'} />
                </Link>
                <Link to="/diagnosis-helper">
                  <Button styleType={'primary'} text={'Diagnosis Helper'} />
                </Link>
              </div>
            </div>
          }
        />
        <Route path="/ai-arena" element={<AIArena />} />
        <Route path="/diagnosis-helper" element={<DiagnosisHelper />} />
      </Routes>
    </div>
  );
}

export default App;
