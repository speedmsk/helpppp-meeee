import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import boards from '/boards.svg';
import { Link } from 'react-router-dom';
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

const ProjectList = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
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
        .get(`https://localhost:7125/getboards?developerId=${userId}`)
        .then((response) => {
            setCards(response.data);
        })
        .catch((error) => console.error('Failed to fetch boards:', error));
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
            </ListCard>
          </div>
          <ImageBoard src={boards} alt="" />
        </div>
      </div>
    </ListContainer>
  );
};

export default ProjectList;
