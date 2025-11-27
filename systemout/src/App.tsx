import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import HomePage from './home/HomePage';
import ExploreUsersPage from './users/ExploreUsersPage';
import Container from 'react-bootstrap/Container'
import NavMenu from './shared/NavMenu';
import UserCreatePage from './users/UserCreatePage';
import UserUpdatePage from './users/UserUpdatePage';
import ImagePage from './images/ImagePage';
import ImageUpdatePage from './images/ImageUpdatePage';
import NotePage from './notes/NotePage';
import NoteUpdatePage from './notes/NoteUpdatePage';
import NoteDetails from './notes/NoteDetails';
import ImageDetails from './images/ImageDetails';
import UploadPage from './upload/UploadPage';

const App: React.FC = () => {
  return (
    <div className='background'>
      <NavMenu />
      <Container>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExploreUsersPage />} />
            <Route path="/usercreate" element={<UserCreatePage/>} />
            <Route path="/userupdate/:userId" element={<UserUpdatePage/>} />
            <Route path="/images" element={<ImagePage />} />
            <Route path="/imagedetails/:imageId" element={<ImageDetails />} />
            <Route path="/imageupdate/:imageId" element={<ImageUpdatePage />} />
            <Route path="/notes" element={<NotePage />} />
            <Route path="/notedetails/:noteId" element={<NoteDetails />} />
            <Route path="/noteupdate/:noteId" element={<NoteUpdatePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </Container>
   </div>
  );
};

export default App;