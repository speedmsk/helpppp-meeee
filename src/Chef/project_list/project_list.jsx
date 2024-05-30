import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import boards from '/boards.svg';
import { Link } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utilities/useAuth';

const TemplateCard = ({ title }) => {
  return (
    <TemplateCardStyled>
      <div className="template-card-overlay">
        <div className="template-card-header">
          <span className="template-card-category">Template</span>
        </div>
        <div className="template-card-body">
          <span className="template-card-title">{title}</span>
        </div>
      </div>
    </TemplateCardStyled>
  );
};

const ListContainer = styled.div`
  padding: 0;
  margin: 0;
  width: 100%;
  background-color: #fff;
  min-height: 100vh;
  overflow-y: hidden; /* Hide horizontal scrollbar */
  position: relative;
  /* Hide scrollbar for WebKit browsers */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;

  /* Enable scrolling */
  overflow: scroll;

  &::before {
    content: "";
    position: absolute;
    height: 2000px;
    width: 2000px;
    top: -10%;
    right: 48%;
    transform: translateY(-50%);
    background-image: linear-gradient(-45deg, #ADD8E6 0%, #23a4fa 50%, #ADD8E6 100%);
    transition: 1.8s ease-in-out;
    border-radius: 50%;
    z-index: 1;
  }
`;

const ImageBoard = styled.img`
  z-index: 11;
  height: 500px;
  position: sticky;
  margin-left: -18cm;
  margin-top: 5cm;
`;

const BoardTitle = styled.div`
  position: relative;
  left: 11cm;
  top: -1cm;
  font-size: 30px;
  font-family: 'Cambria', 'Cochin', Georgia, Times, 'Times New Roman', serif;
`;

const TemplateCardStyled = styled.div`
  position: relative;
  width: 200px;
  height: 150px;
  background-size: cover;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: white;
  margin: 15px;
  cursor: pointer;

  .template-card-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url('/dashboard.webp');
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px;
  }

  .template-card-header {
    align-self: flex-start;
  }

  .template-card-category {
    background: #333;
    border-radius: 5px;
    padding: 5px 10px;
    font-size: 0.75rem;
    text-transform: uppercase;
  }

  .template-card-body {
    align-self: flex-end;
  }

  .template-card-title {
    font-size: 1.25rem;
    font-weight: bold;
  }
`;

const ListCard = styled.div`
  position: relative;
  display: grid;
  column-gap: 50px;
  grid-template-columns: auto auto auto;
  align-items: flex-start;
  padding: 20px;
  left: 145%;
`;

const AddCardButton = styled(Dropdown.Toggle)`
  padding: 10px 20px;
  background-color: #545454;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 150px;
  align-items: center;
  justify-content: center;
  margin: 15px;
  left: 18cm;
  top: -2cm;

  &:hover {
    background-color: #494949;
  }
`;

const StyledDropdownMenu = styled(Dropdown.Menu)`
  padding: 20px;
  width: 300px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const StyledHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
`;

const StyledFormGroup = styled.div`
  margin-bottom: 1rem;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  box-sizing: border-box;
`;

const StyledButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const ProjectList = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [boardTitle, setBoardTitle] = useState('');
  const userId = useSelector((state) => state.user.userData.userId);

  useEffect(() => {
    if (userId) {
      fetchBoards();
    } else {
      // Redirect to login if userId is not available
      navigate('/');
    }
  }, [userId, navigate]);

  const fetchBoards = () => {
    axios
      .get(`https://localhost:7125/getboards?userId=${userId}`)
      .then((response) => {
        const userBoards = response.data.filter((board) => board.userId === userId);
        setCards(userBoards);
      })
      .catch((error) => console.error('Failed to fetch boards:', error));
  };

  const addNewBoard = () => {
    const newBoard = {
      title: boardTitle,
      columnsOrder: [],
      userId: userId, // Ensure the userId field is correct
    };

    axios
      .post('https://localhost:7125/addboard', newBoard, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setCards((prevCards) => [...prevCards, response.data]);
        setBoardTitle('');
      })
      .catch((error) => {
        console.error('Error adding board:', error);
      });
  };

  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem("userData");
    logout();
    navigate("/");
  };

  return (
    <ListContainer>
      <div className="swapp">
        <div className="panels-container">
          <div className="panel left-panel">
            <BoardTitle>WORKSPACES</BoardTitle>
            <button onClick={handleLogout}>Logout</button>
            <ListCard>
              {cards.map((card, index) => (
                <Link to={`/dashboard/${card.id}`} key={index} style={{ textDecoration: 'none' }}>
                  <TemplateCard title={card.title} />
                </Link>
              ))}
              <Dropdown>
                <AddCardButton>Add new Board</AddCardButton>
                <StyledDropdownMenu>
                  <StyledHeader>Create</StyledHeader>
                  <StyledFormGroup>
                    <label htmlFor="BoardTitle">Board Title</label>
                    <StyledInput
                      type="text"
                      id="BoardTitle"
                      placeholder="Enter Board Title"
                      value={boardTitle}
                      onChange={(e) => setBoardTitle(e.target.value)}
                    />
                  </StyledFormGroup>
                  <StyledButton onClick={addNewBoard}>
                    Add New Board
                  </StyledButton>
                </StyledDropdownMenu>
              </Dropdown>
            </ListCard>
          </div>
          <ImageBoard src={boards} alt="" />
        </div>
      </div>
    </ListContainer>
  );
};

export default ProjectList;
