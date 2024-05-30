import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';

const Container = styled.div`
    background-color: white;
`;

const Title = styled.h1`
    text-align: center;
    color: #333;
    margin-top: 20px;
`;

const Table = styled.table`
    width: 100%;
    margin: 0px;
    border-collapse: collapse;
`;

const Th = styled.th`
    background-color: #00a6ff;
    color: white;
    text-transform: uppercase;
    border-bottom: 1px solid #ddd;
`;

const Td = styled.td`
    text-align: left;
    padding: 12px;
    border-bottom: 1px solid #ddd;
    color: #333;
`;

const TrHover = styled.tr`
    &:hover {
        background-color: #f5f5f5;
    }
`;

const CustomButton = styled(Button)`
    margin: 3px;
`;

function AllBoards() {
    const [boards, setBoards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(false);
    const [selectedBoard, setSelectedBoard] = useState({ id: '', title: '', developerIds: [] });
    const [developerId, setDeveloperId] = useState('');
    const [developers, setDevelopers] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        fetchBoards();
    }, []);

    const fetchBoards = () => {
        setIsLoading(true);
        axios.get('https://localhost:7125/getboards')
            .then(response => {
                setBoards(response.data);
            })
            .catch(error => {
                console.error('Error fetching boards:', error);
                setError('An error occurred while fetching boards.');
            })
            .finally(() => setIsLoading(false));
    };

    const fetchDevelopers = () => {
        axios.get('https://localhost:7125/getDevelopers')
            .then(response => {
                setDevelopers(response.data);
            })
            .catch(error => {
                console.error('Error fetching developers:', error);
                setError('An error occurred while fetching developers.');
            });
    };

    const handleEdit = (board) => {
        setSelectedBoard({ ...board, developerIds: Array.isArray(board.DeveloperIds) ? board.DeveloperIds : [] });
        fetchDevelopers();
        handleShow();
    };
    const handleSave = (e) => {
        e.preventDefault();
        const updatedDeveloperIds = selectedBoard.developerIds;
    
        if (developerId) {
            updatedDeveloperIds.push(parseInt(developerId));
        }
    
        axios.put(`https://localhost:7125/assignDevelopers/${selectedBoard.id}`, updatedDeveloperIds, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(() => {
            console.log("Board updated successfully");
            fetchBoards(); // Fetch boards after update
            handleClose();
        })
        .catch(error => {
            console.error('Error updating board:', error);
            setError('Failed to update board.');
        });
    };
    

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <Container>
            <Title>All Boards</Title>
            <Table className="table">
                <thead>
                    <tr>
                        <Th>ID</Th>
                        <Th>Title</Th>
                        <Th>Developers</Th>
                        <Th>Actions</Th>
                    </tr>
                </thead>
                <tbody>
                    {boards.map(board => (
                        <TrHover key={board.id}>
                            <Td>{board.id}</Td>
                            <Td>{board.title}</Td>
                            <Td>
                                {Array.isArray(board.DeveloperIds) && board.DeveloperIds.length > 0 ? 
                                    board.DeveloperIds.join(', ') : 'No developers assigned'}
                            </Td>
                            <Td>
                                <CustomButton variant="info" size="sm" onClick={() => handleEdit(board)}>Edit Developers</CustomButton>
                            </Td>
                        </TrHover>
                    ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Developers</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Developer ID</Form.Label>
                            <Form.Control
                                as="select"
                                value={developerId}
                                onChange={(e) => setDeveloperId(e.target.value)}
                            >
                                <option value="">Select Developer</option>
                                {developers.map(dev => (
                                    <option key={dev.id} value={dev.id}>{dev.id}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default AllBoards;
