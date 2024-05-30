import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import "./column.scss";
import Card from '../Card/Card';
import { mapOrder } from "../../utilities/sort";
import { Container, Draggable } from "react-smooth-dnd";
import Dropdown from 'react-bootstrap/Dropdown';
import ConfirmModal from "../Common/ConfirmModal";
import Form from "react-bootstrap/Form";
import { MODAL_ACTION_CONFIRM } from '../../utilities/constant';
import { applyDrag } from '../../utilities/dragDrop';

const Column = ({ column, onCardDrop, updateColumnOrder }) => {
    const [cards, setCards] = useState([]);
    const [titleColumn, setTitleColumn] = useState(column.title || "");
    const [isShowModalDelete, setShowModalDelete] = useState(false);
    const [isShowAddNewCard, setIsShowAddNewCard] = useState(false);
    const [valueTextArea, setValueTextArea] = useState("");
    const inputRef = useRef(null);
    const textAreaRef = useRef(null);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await axios.get(`https://localhost:7125/ByColumn/${column.id}`);
                setCards(mapOrder(response.data, column.cardOrder, 'id'));
            } catch (error) {
                console.error('Failed to fetch cards:', error);
            }
        };

        fetchCards();
    }, [column.id]); // Only depend on column.id to prevent infinite loop

    const toggleModal = () => setShowModalDelete(!isShowModalDelete);

    const onModalAction = (type) => {
        if (type === MODAL_ACTION_CONFIRM) {
            updateColumnOrder({ ...column, _destroy: true });
        }
        toggleModal();
    };

    const handleClickOutside = () => {
        updateColumnOrder({ ...column, title: titleColumn });
    };

    const handleAddNewCard = () => {
        if (!valueTextArea) {
            textAreaRef.current.focus();
            return;
        }

        axios.post('https://localhost:7125/addcard', {
            ColumnId: column.id,
            Title: valueTextArea,
        }).then(response => {
            const savedCard = response.data;
            const newCards = [...cards, savedCard];
            const newCardOrder = newCards.map(card => card.id);

            axios.patch(`https://localhost:7125/updateCardOrder/${column.id}`, { newCardOrder })
                .then(() => {
                    setCards(newCards);
                    column.cardOrder = newCardOrder;
                    setValueTextArea("");
                    setIsShowAddNewCard(false);
                })
                .catch(error => {
                    console.error('Failed to update card order:', error);
                });
        }).catch(error => {
            console.error('Failed to add card:', error);
        });
    };

    const handleCardDrop = (dropResult) => {
        if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
            const newCards = applyDrag(cards, dropResult);
            setCards(newCards);

            const newCardOrder = newCards.map(card => card.id);

            // Update the card order on the server after a card is moved
            axios.patch(`https://localhost:7125/updateCardOrder/${column.id}`, { newCardOrder })
                .then(() => {
                    column.cardOrder = newCardOrder;

                    // Check if the card was moved between columns
                    if (dropResult.payload.columnId !== column.id) {
                        axios.patch(`https://localhost:7125/updateCardColumn/${dropResult.payload.id}`, { 
                            newColumnId: column.id,
                            newCardOrder 
                        })
                        .then(() => {
                            console.log("Card column updated successfully");
                        })
                        .catch(error => {
                            console.error('Failed to update card column:', error);
                        });
                    }

                    console.log("Card order updated successfully:", newCardOrder);
                })
                .catch(error => {
                    console.error('Failed to update card order:', error);
                });
        }
    };

    return (
        <div className="column">
            <header className="column-drag-handle">
                <div className="column-title">
                    <Form.Control
                        size="sm"
                        type="text"
                        value={titleColumn}
                        className="customize-input-column"
                        onChange={(event) => setTitleColumn(event.target.value)}
                        onBlur={handleClickOutside}
                        ref={inputRef}
                    />
                    <div className="column-dropdown">
                        <Dropdown>
                            <Dropdown.Toggle variant="" id="dropdown-basic" size="sm">
                                
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={toggleModal}>Remove this column...</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </header>
            <div className='card-list'>
                <Container
                    groupName="col"
                    onDrop={handleCardDrop}
                    getChildPayload={index => cards[index]}
                    dragClass="card-ghost"
                    dropClass="card-ghost-drop"
                    dropPlaceholder={{
                        animationDuration: 150,
                        showOnTop: true,
                        className: 'card-drop-preview'
                    }}
                >
                    {cards.map((card, index) => (
                        <Draggable key={card.id}>
                            <Card card={card} columnTitle={column.title} index={index + 1} />
                        </Draggable>
                    ))}
                </Container>
                {isShowAddNewCard && (
                    <div className="add-new-card">
                        <textarea
                            className='form-control'
                            rows="2"
                            placeholder="Enter a title for this card..."
                            ref={textAreaRef}
                            value={valueTextArea}
                            onChange={(event) => setValueTextArea(event.target.value)}
                        ></textarea>
                        <button className='btn btn-primary' onClick={handleAddNewCard}>Add Card</button>
                        <i className='fa fa-times icon' onClick={() => setIsShowAddNewCard(false)}></i>
                    </div>
                )}
            </div>
            {!isShowAddNewCard && (
                <footer>
                    <div className="footer-action" onClick={() => setIsShowAddNewCard(true)}>
                        <i className="fa fa-plus icon"></i> Add card
                    </div>
                </footer>
            )}
            <ConfirmModal
                show={isShowModalDelete}
                title={"Remove a column"}
                content={`Are you sure you want to remove this column: <b>${column.title}</b>?`}
                onAction={onModalAction}
            />
        </div>
    );
};

export default Column;
