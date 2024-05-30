import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { FaCheckCircle } from 'react-icons/fa';
import './Card.scss';
import { titleBoard } from '../BoardBar/BoardBar';

const API_BASE_URL = 'https://localhost:7125';

const Card = (props) => {
    const { card, columnTitle, index } = props;
    const [showModal, setShowModal] = useState(false);
    const [checklists, setChecklists] = useState([]);
    const [newChecklistTitle, setNewChecklistTitle] = useState('');
    const [checklistProgress, setChecklistProgress] = useState({ totalItems: 0, completedItems: 0 });

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const fetchChecklists = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/ItemsByCardId/${card.id}`);
            const checklistsWithItems = response.data.map(checklist => ({
                ...checklist,
                items: checklist.items || []
            }));
            setChecklists(checklistsWithItems);
            updateChecklistProgress(checklistsWithItems);
        } catch (error) {
            console.error("Error fetching checklists", error);
        }
    };

    useEffect(() => {
        if (card.id) {
            fetchChecklists();
        }
    }, [card.id]);

    const handleAddChecklist = async () => {
        if (!newChecklistTitle.trim()) {
            return;
        }
        const newChecklist = {
            title: newChecklistTitle.trim(),
            items: [],
            cardId: card.id
        };
        try {
            const response = await axios.post(`${API_BASE_URL}/addChecklist`, newChecklist);
            const updatedChecklists = [...checklists, response.data];
            setChecklists(updatedChecklists);
            setNewChecklistTitle('');
            updateChecklistProgress(updatedChecklists);
        } catch (error) {
            console.error("Error adding checklist", error.response ? error.response.data : error.message);
        }
    };

    const updateChecklists = async (updatedChecklists) => {
        setChecklists(updatedChecklists);
        updateChecklistProgress(updatedChecklists);

        updatedChecklists.forEach(async (checklist) => {
            try {
                await axios.put(`${API_BASE_URL}/updateChecklist/${checklist.id}`, checklist, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } catch (error) {
                console.error('Error updating checklist:', error.response ? error.response.data : error.message);
            }
        });
    };

    const getChecklistProgress = (checklists) => {
        const totalItems = checklists.reduce((acc, checklist) => acc + checklist.items.length, 0);
        const completedItems = checklists.reduce((acc, checklist) => acc + checklist.items.filter(item => item.isCompleted).length, 0);
        return { totalItems, completedItems };
    };

    const updateChecklistProgress = (checklists) => {
        const progress = getChecklistProgress(checklists);
        setChecklistProgress(progress);
    };

    const { totalItems, completedItems } = checklistProgress;

    return (
        <div className='Card-item'>
            {card.cover && (
                <img
                    className='card-cover'
                    src={card.cover}
                    alt="Card cover"
                    onMouseDown={event => event.preventDefault()}
                />
            )}
            <div className='card-title' onClick={handleShowModal}>
                {card.title}
                {totalItems > 0 && (
                    <span className="checklist-progress">
                        <FaCheckCircle /> {completedItems}/{totalItems}
                    </span>
                )}
            </div>

            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Body className='modal-body'>
                    <Modal.Title>{card.title}</Modal.Title>
                    <div className="column-dropdown2">
                        <Dropdown className='Dropdown'>
                            <Dropdown.Toggle variant="" id="dropdown-basic" size="sm" className="underline-title">
                                {columnTitle || "Default Column Title"}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className='dropdown-menu'>
                                <div className='row justify-content-end '>
                                    <div className="modal-header">
                                        <span>Move Card</span>
                                        <button className="close-modal">
                                            <Dropdown.Item>&times;</Dropdown.Item>
                                        </button>
                                    </div>
                                    <div className="destination-selection">
                                        <span>Select Destination</span>
                                        <div className="destination-inputs">
                                            <div className="input-group">
                                                <label>Board</label>
                                                <input type="text" placeholder={titleBoard} disabled />
                                            </div>
                                            <div className="input-group">
                                                <label>List</label>
                                                <input type="text" placeholder={columnTitle} disabled />
                                            </div>
                                            <div className="input-group">
                                                <label>Position</label>
                                                <input type="number" value={index} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <Form.Group controlId="formAddChecklist">
                        <div className='Container'>
                            <div className='row justify-content-end '>
                                <div className="col-auto">
                                    <div className="button-container">
                                        <button className="btn btn-details">
                                            <Dropdown>
                                                <Dropdown.Toggle variant="" id="dropdown-basic" size="sm" className="transparent-border hide-dropdown-arrow btn btn-primary">
                                                    Checklist
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu className="custom-dropdown-menu">
                                                    <div className="modal-header">
                                                        <span>Add New Checklist</span>
                                                        <button className="close-modal">&times;</button>
                                                    </div>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Add a new checklist"
                                                        value={newChecklistTitle}
                                                        onChange={(e) => setNewChecklistTitle(e.target.value)}
                                                    />
                                                    <Button variant="primary" onClick={handleAddChecklist}>Add</Button>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form.Group>

                    {checklists.map((checklist) => (
                        <ChecklistComponent
                            key={checklist.id}
                            checklist={checklist}
                            checklists={checklists}
                            setChecklists={updateChecklists}
                        />
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

const ChecklistComponent = ({ checklist, checklists, setChecklists }) => {
    const [newItemText, setNewItemText] = useState('');

    useEffect(() => {
        const fetchChecklistItems = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/ItemsByChecklistId/${checklist.id}`);
                const updatedChecklists = checklists.map(cl => {
                    if (cl.id === checklist.id) {
                        return { ...cl, items: response.data };
                    }
                    return cl;
                });
                setChecklists(updatedChecklists);
            } catch (error) {
                console.error("Error fetching checklist items", error);
            }
        };

        fetchChecklistItems();
    }, [checklist.id]);

    const handleCheckItem = async (checklistId, itemId, isCompleted) => {
        const updatedChecklists = checklists.map(cl => {
            if (cl.id === checklistId) {
                return {
                    ...cl,
                    items: cl.items.map(item =>
                        item.id === itemId ? { ...item, isCompleted } : item
                    )
                };
            }
            return cl;
        });

        setChecklists(updatedChecklists);

        try {
            await axios.patch(`${API_BASE_URL}/IsComplete/${itemId}`, { isComplete: isCompleted });
            const updatedChecklist = updatedChecklists.find(cl => cl.id === checklistId);
            await axios.put(`${API_BASE_URL}/updateChecklist/${checklist.id}`, updatedChecklist, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error("Error updating checklist item", error);
        }
    };

    const handleAddItem = async () => {
        if (!newItemText.trim()) {
            return;
        }
        try {
            const response = await axios.post(`${API_BASE_URL}/addChecklistItem`, {
                text: newItemText.trim(),
                isCompleted: false,
                checklistId: checklist.id
            });
            const updatedChecklists = checklists.map(cl => {
                if (cl.id === checklist.id) {
                    return {
                        ...cl,
                        items: [...cl.items, response.data]
                    };
                }
                return cl;
            });
            setChecklists(updatedChecklists);
            setNewItemText('');
        } catch (error) {
            console.error("Error adding checklist item", error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className='Checklist'>
            <div className='Checklist-header'>
                <span>{checklist.title}</span>
            </div>
            <div className='Checklist-items'>
                {checklist.items && checklist.items.map((item) => (
                    <div key={item.id} className='Checklist-item'>
                        <Form.Check
                            type="checkbox"
                            checked={item.isCompleted}
                            onChange={(e) => handleCheckItem(checklist.id, item.id, e.target.checked)}
                            label={item.text}
                        />
                    </div>
                ))}
            </div>
            <div className='Checklist-add-item'>
                <Form.Control
                    type="text"
                    placeholder="Add a new item"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                />
                <Button variant="primary" onClick={handleAddItem}>Add</Button>
            </div>
        </div>
    );
};

export default Card;
