import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';

const Container = styled.body`
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

function Users() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(false);
    const [selectedUser, setSelectedUser] = useState({ id: '', name: '', post: '', tel: '', mydate: '', email: '', IsActive: true });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        setIsLoading(true);
        axios.get('https://localhost:7125/getUsers')
            .then(response => {
                console.log('API Response:', response.data);
                if (Array.isArray(response.data)) {
                    setUsers(response.data);
                    Cookies.set('users', JSON.stringify(response.data), { expires: 7 });
                } else {
                    throw new Error('Data format error: Expected an array of users.');
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError('An error occurred while fetching data.');
            })
            .finally(() => setIsLoading(false));
    };

    const handleEdit = (id) => {
        const userToEdit = users.find(user => user.id === id);
        if (userToEdit) {
            setSelectedUser(userToEdit);
            handleShow();
        }
    };

    const handleDelete = (id) => {
        axios.delete(`https://localhost:7125/deleteUser/${id}`)
            .then(() => {
                fetchUsers(); // Fetch users after delete
            })
            .catch(error => {
                console.error('Error deleting user:', error);
                setError('Failed to delete user.');
            });
    };

    const handleSave = (e) => {
        e.preventDefault();
        const url = `https://localhost:7125/updateUser/${selectedUser.id}`;
        axios.put(url, selectedUser)
            .then(() => {
                fetchUsers(); // Fetch users after update
                handleClose();
            })
            .catch(error => {
                console.error('Error updating user:', error);
                setError('Failed to update user.');
            });
    };

    const toggleUserActiveStatus = async (id, isActive) => {
        console.log(`Sending PATCH request to update user ID ${id} to isActive: ${isActive}`);

        try {
            // Send the PATCH request
            await axios.patch(`https://localhost:7125/patchUserActiveStatus/${id}`, { isActive: isActive });

            // Update the state with the new status
            const updatedUsers = users.map(user => {
                if (user.id === id) {
                    return { ...user, isActive: isActive };
                }
                return user;
            });
            setUsers(updatedUsers);
            Cookies.set('users', JSON.stringify(updatedUsers), { expires: 365 });

            // Optionally, refetch the users to ensure consistency
            // fetchUsers();
        } catch (error) {
            console.error('Error updating user active status:', error.response?.data || error.message);
            setError('Failed to update user active status. ' + (error.response?.data || error.message));
        }
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <Container>
            <Title>User List</Title>
            <Table className="table">
                <thead>
                    <tr>
                        <Th>ID</Th>
                        <Th>Name</Th>
                        <Th>Post</Th>
                        <Th>Telephone</Th>
                        <Th>Date</Th>
                        <Th>Email</Th>
                        <Th>Active</Th>
                        <Th>Actions</Th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <TrHover key={user.id}>
                            <Td>{user.id}</Td>
                            <Td>{user.name}</Td>
                            <Td>{user.post}</Td>
                            <Td>{user.tel}</Td>
                            <Td>{user.mydate}</Td>
                            <Td>{user.email}</Td>
                            <Td>{user.isActive ? 'Yes' : 'No'}</Td>
                            <Td>
                                <CustomButton variant="info" size="sm" onClick={() => handleEdit(user.id)}>Edit</CustomButton>{' '}
                                <CustomButton variant="danger" size="sm" onClick={() => handleDelete(user.id)}>Delete</CustomButton>{' '}
                                <CustomButton variant={user.isActive ? 'secondary' : 'success'} size="sm" onClick={() => toggleUserActiveStatus(user.id, !user.isActive)}>
                                    {user.isActive ? 'Deactivate' : 'Activate'}
                                </CustomButton>
                            </Td>
                        </TrHover>
                    ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSave}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter name" value={selectedUser.name} onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Post</Form.Label>
                            <Form.Control type="text" placeholder="Enter post" value={selectedUser.post} onChange={(e) => setSelectedUser({ ...selectedUser, post: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Telephone</Form.Label>
                            <Form.Control type="text" placeholder="Enter telephone" value={selectedUser.tel} onChange={(e) => setSelectedUser({ ...selectedUser, tel: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" value={selectedUser.mydate} onChange={(e) => setSelectedUser({ ...selectedUser, mydate: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" value={selectedUser.email} onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })} />
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

export default Users;
