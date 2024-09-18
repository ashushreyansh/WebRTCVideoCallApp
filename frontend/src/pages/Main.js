import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import socket from "../socket";

const Main = ({ history }) => {
  const roomRef = useRef(null);
  const userRef = useRef(null);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleError = ({ error }) => {
      if (!error) {
        const roomName = roomRef.current.value;
        const userName = userRef.current.value;

        sessionStorage.setItem("user", userName);
        navigate(`/room/${roomName}`);
      } else {
        setError(true);
        setErrorMessage("User name already exists");
      }
    };

    socket.on("FE-error-user-exist", handleError);

    return () => {
      socket.off("FE-error-user-exist", handleError);
    };
  }, [navigate]);

  const handleJoin = () => {
    const roomName = roomRef.current.value;
    const userName = userRef.current.value;

    if (!roomName || !userName) {
      setError(true);
      setErrorMessage("Enter Room Name and User Name");
    } else {
      console.log("sending BE-check-user", { roomId: roomName, userName });
      socket.emit("BE-check-user", { roomId: roomName, userName });
    }
  };

  return (
    <MainContainer>
      <Row>
        <Label htmlFor="roomName">Room Name</Label>
        <Input type="text" id="roomName" ref={roomRef} />
      </Row>
      <Row>
        <Label htmlFor="userName">User Name</Label>
        <Input type="text" id="userName" ref={userRef} />
      </Row>
      <JoinButton onClick={handleJoin}>Join</JoinButton>
      {error && <Error>{errorMessage}</Error>}
    </MainContainer>
  );
};

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 15px;
  line-height: 35px;
`;

const Label = styled.label`
  font-size: 18px;
`;

const Input = styled.input`
  width: 150px;
  height: 35px;
  margin-left: 15px;
  padding-left: 10px;
  outline: none;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Error = styled.div`
  margin-top: 10px;
  font-size: 18px;
  color: #e85a71;
`;

const JoinButton = styled.button`
  height: 40px;
  margin-top: 35px;
  outline: none;
  border: none;
  border-radius: 15px;
  color: #d8e9ef;
  background-color: #4ea1d3;
  font-size: 18px;
  font-weight: 500;

  :hover {
    background-color: #7bb1d1;
    cursor: pointer;
  }
`;

export default Main;
