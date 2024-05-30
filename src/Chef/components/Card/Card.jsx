// import React from 'react';
// import './Card.scss';


// const Card = (props) => {
//     const {card}=props

//     return (
//         <div className='Card-item'>
//             {card.image && <img className='card-cover' src={card.image}
            
//                 onMouseDown={event=>event.preventDefault()}
//             />}
//             {card.title}
//         </div>
//     );
// };

// export default Card;


// Card.js


import React, { useState } from 'react';
import { Button, Modal, Form, ProgressBar } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import './Card.scss';
import Dropdown from 'react-bootstrap/Dropdown';
import { titleBoard } from '../BoardBar/BoardBar';

const Card = (props) => {
    const { card, columnTitle,index } = props;
    const [showModal, setShowModal] = useState(false);
    const [checklists, setChecklists] = useState([]);
    const [newChecklistTitle, setNewChecklistTitle] = useState('');
    

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleAddChecklist = () => {
        if (!newChecklistTitle.trim()) {
            return;
        }
        const newChecklist = {
            id: uuidv4(),
            title: newChecklistTitle.trim(),
            items: []
        };
        setChecklists([...checklists, newChecklist]);
        setNewChecklistTitle('');
    };

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
            </div>

            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Body className='modal-body'>
                    <Modal.Title >{card.title}</Modal.Title>
                    <div className="column-dropdown2">
                     <Dropdown className='Drop-down'>
                             Dans la list
                            <Dropdown.Toggle variant="" id="dropdown-basic" size="sm"  className="underline-title"  >{columnTitle || "Default Column Title"} </Dropdown.Toggle>
                            

                     <Dropdown.Menu className='dropdown-menu'>
                     <div className='row justify-content-end '>
                             
                             <div class="modal-header">
                                <span>Déplacer la carte</span>
                                <button class="close-modal"> <Dropdown.Item>&times;</Dropdown.Item></button>
                            </div>
                            <div class="destination-selection">
            <span>Sélectionner une destination</span>
            <div class="destination-inputs">
              <div class="input-group">
                <label>Tableau</label>
                <input type="text" placeholder={titleBoard} disabled/>
              </div>
              <div class="input-group">
                <label>Liste</label>
                <input type="text" placeholder={columnTitle} disabled/>
              </div>
              <div class="input-group">
                <label>Position</label>
                <input type="number" value={index}/>
              </div>
            </div>
          </div>        
                        </div>
                        
                         
                     </Dropdown.Menu>
                    </Dropdown>
            </div>
                    
                    {/* Add a new checklist */}
                    <Form.Group controlId="formAddChecklist">
                        
                        <div className='Container'>
                        <div className='row justify-content-end '>
                             <div className="col-auto">
                                <button className="btn btn-details">
                                    
                                    <Dropdown>
                                    <Dropdown.Toggle variant=""  id="dropdown-basic"  size="sm" className="transparent-border hide-dropdown-arrow btn btn-primary "> Checklist </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                        <div class="modal-header">
                                <span>Déplacer la carte</span>
                                <button class="close-modal"> <Dropdown.Item>&times;</Dropdown.Item></button>
                            </div>
                                        <Form.Control
                            type="text"
                            placeholder="Add a new checklist"
                            value={newChecklistTitle}
                            onChange={(e) => setNewChecklistTitle(e.target.value)}
                        />
                        <Button variant="primary" onClick={handleAddChecklist}>Add </Button>

                                        </Dropdown.Menu>
                                    </Dropdown>
                                    
                                    </button>
                            </div>
                        </div>
                        </div>
                    </Form.Group>

                    {/* Display all checklists */}
                    {checklists.map((checklist) => (
                        <ChecklistComponent 
                            key={checklist.id} 
                            checklist={checklist} 
                            checklists={checklists}
                            setChecklists={setChecklists}
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

    const handleCheckItem = (checklistId, itemId) => {
        const newChecklists = checklists.map(cl => {
            if (cl.id === checklistId) {
                return {
                    ...cl,
                    items: cl.items.map(item => 
                        item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
                    )
                };
            }
            return cl;
        });
        setChecklists(newChecklists);
    };

    const handleAddItem = (checklistId) => {
        if (!newItemText.trim()) {
            return;
        }
        const newItem = { id: uuidv4(), text: newItemText.trim(), isCompleted: false };
        const newChecklists = checklists.map(cl => {
            if (cl.id === checklistId) {
                return {
                    ...cl,
                    items: [...cl.items, newItem]
                };
            }
            return cl;
        });

        setChecklists(newChecklists);
        setNewItemText('');
    };

    const getProgress = () => {
        const completedItems = checklist.items.filter(item => item.isCompleted).length;
        return checklist.items.length > 0 ? (completedItems / checklist.items.length) * 100 : 0;
    };

    return (
        <div className='checklist-container'>
            <h5>{checklist.title}</h5>
            <ProgressBar className='progress ' icon="fa-regular fa-square-check" now={getProgress()} label={`${getProgress()}%`} />
            {checklist.items.map((item) => (
                <Form.Check 
                    key={item.id}
                    type="checkbox" 
                    label={item.text}
                    checked={item.isCompleted}
                    onChange={() => handleCheckItem(checklist.id, item.id)}
                />
            ))}
            <Form.Group controlId="formAddItemToChecklist">
                <Form.Control
                    type="text"
                    placeholder="Add an item"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                />
                <Button variant="primary" onClick={() => handleAddItem(checklist.id)}>Add Item</Button>
            </Form.Group>
        </div>
    );
};

export default Card;


