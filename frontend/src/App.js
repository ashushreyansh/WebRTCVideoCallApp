import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import Room from './components/Room';
import styled from 'styled-components';

function App() {
  return (
    <Router>
      <AppContainer>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/room/:roomName" element={<Room />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  font-size: calc(8px + 2vmin);
  color: white;
  background-color: #454552;
  text-align: center;
`;

export default App;
