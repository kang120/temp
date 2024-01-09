import logo from './logo.svg';
import './App.css';
import UploadView from './UploadView';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path='/' element={<UploadView />} />
                    <Route path='/plagiarism_check' element={<UploadView />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
