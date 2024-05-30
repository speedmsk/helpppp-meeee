import React from 'react';
import styled from 'styled-components';
import AppBar from '../components/AppBar/AppBar';
import BoardBar from '../components/BoardBar/BoardBar';
import BoardContent from '../components/boardContent/BoardContent';
import 'bootstrap/dist/css/bootstrap.min.css';
import imgboard from '/dashboard.webp';


const Body=styled.body`
`
const DashboardContainer = styled.div`
    background-image: url(${imgboard});
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: fixed;
    overflow-y: hidden;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.3em;
    font-size: 14px;
   /* Hide horizontal scrollbar */
    &::-webkit-scrollbar {
        display: none;
    }
  
`;

const DashContainer = styled.div`
    padding: 0;
    margin: 0;
    width: 120%;
    min-height: 100vh;
    min-width: 100%;
   
    position: relative;
    &::before {
        content: "";
        position: absolute;
        height: 2000px;
        width: 2000px;
        top: -10%;
        right: 48%;
        transform: translateY(-50%);
        transition: 1.8s ease-in-out;
        border-radius: 50%;
        z-index: 3;
    }
`;

const TaskManager = styled.div`
    height: 100vh;
    display: grid;
    color: #333;
`;

const Panel = styled.div`
    z-index: 6;
`;

const LeftPanel = styled(Panel)`
    position: absolute;
    padding: 0;
`;

const Content = styled.div`
    color: #fff;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.6s;
`;

const AppBarWrapper = styled.div`
    width: 123%;
`;

const BoardBarWrapper = styled.div`
    width: 123%;
    padding-bottom: 30px;
    margin-bottom: 90px;
`;

const BoardContentWrapper = styled.div`
    margin-left: 90px;
`;

const CustomInput = styled.input`
    border: none;
    cursor: pointer;
    background-color: inherit;
    &:focus {
        outline: none !important;
        box-shadow: none !important;
    }
`;

function Dashboard() {
    return (
        <Body>
        <DashboardContainer>
            <DashContainer>
                <TaskManager>
                    <LeftPanel>
                        <Content>
                            <AppBarWrapper>
                                {/* <AppBar /> */}
                            </AppBarWrapper>
                            <BoardBarWrapper>
                                {/* <BoardBar /> */}
                            </BoardBarWrapper>
                            <BoardContentWrapper>
                                <BoardContent />
                            </BoardContentWrapper>
                        </Content>
                    </LeftPanel>
                </TaskManager>
            </DashContainer>
        </DashboardContainer>
        </Body>
    );
}

export default Dashboard;
