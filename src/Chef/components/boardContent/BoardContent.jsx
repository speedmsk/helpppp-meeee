import './boardContent.scss';
import Column from '../column/column';
import { useState, useEffect, useRef } from 'react';
import { Container, Draggable } from "react-smooth-dnd";
import axios from 'axios';
import { Navigate, useParams } from 'react-router-dom';
import { applyDrag } from '../../utilities/dragDrop';

const BoardContent = () => {
    const { boardId } = useParams();
    const [columns, setColumns] = useState([]);
    const [columnsOrder, setColumnsOrder] = useState([]);
    const [isShowAddList, setIsShowAddList] = useState(false);
    const inputRef = useRef(null);
    const [valueInput, setValueInput] = useState("");

    useEffect(() => {
        if (isShowAddList && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isShowAddList]);

    useEffect(() => {
        axios.get(`https://localhost:7125/getboard/${boardId}`)
            .then(response => {
                const board = response.data;
                setColumnsOrder(board.columnsOrder || []);
                axios.get(`https://localhost:7125/ByBoard/${boardId}`)
                    .then(response => {
                        const fetchedColumns = response.data;
                        const sortedColumns = fetchedColumns.sort((a, b) => columnsOrder.indexOf(a.id.toString()) - columnsOrder.indexOf(b.id.toString()));
                        setColumns(sortedColumns.map(column => ({ ...column, cards: column.cards || [] }))); // Ensure cards are always an array
                        console.log("welcome Here");
                    })
                    .catch(error => {
                        console.error('Failed to fetch columns:', error);
                        Navigate('/')
                    });
            })
            .catch(error => {
                console.error('Failed to fetch board:', error);
            });
    }, [boardId, columnsOrder]);

    const onColumnDrop = (dropResult) => {
        if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
            const newColumns = applyDrag(columns, dropResult);
            const newOrder = newColumns.map(column => column.id.toString());
            setColumns(newColumns);
            setColumnsOrder(newOrder);

            // Send the new order to the backend
            axios.patch(`https://localhost:7125/updateColumnOrder/${boardId}`, { newOrder })
                .then(response => {
                    console.log('Column order updated successfully:', response.data);
                })
                .catch(error => {
                    console.error('Failed to update column order:', error);
                });
        }
    };

    const onCardDrop = (dropResult, columnId) => {
        if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
            console.log(">>> inside onCardDrop: ", dropResult, 'with columnId=', columnId);

            let newColumns = [...columns];

            let currentColumn = newColumns.find(column => column.id === columnId);
            if (!currentColumn) {
                console.error(`Column with id ${columnId} not found.`);
                return;
            }
            if (!Array.isArray(currentColumn.cards)) {
                console.error(`Column with id ${columnId} has no cards array.`);
                currentColumn.cards = [];
            }
            console.log("Current column cards before applying drag:", currentColumn.cards);
            currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
            currentColumn.cards = currentColumn.cards.filter(card => card !== undefined); // Ensure no undefined cards are present
            currentColumn.cardOrder = currentColumn.cards.map(card => card.id);
            console.log("Current column cards after applying drag:", currentColumn.cards);

            setColumns(newColumns);

            // Update the card order in the backend
            axios.patch(`https://localhost:7125/updateCardOrder/${columnId}`, currentColumn.cardOrder)
                .then(response => {
                    console.log('Card order updated successfully:', response.data);
                })
                .catch(error => {
                    console.error('Failed to update card order:', error);
                });
        }
    };

    const handleAddList = () => {
        if (!valueInput) {
            inputRef.current?.focus();
            return;
        }

        const newColumn = {
            title: valueInput,
            cardOrder: [],
            boardId: boardId
        };

        axios.post('https://localhost:7125/addcolumn', newColumn)
            .then(response => {
                const savedColumn = response.data;
                const updatedColumns = [...columns, savedColumn];
                setColumns(updatedColumns.map(column => ({ ...column, cards: column.cards || [] }))); // Ensure cards are always an array
                const newOrder = updatedColumns.map(column => column.id.toString());
                setColumnsOrder(newOrder);

                // Send updated column order to the server
                axios.patch(`https://localhost:7125/updateColumnOrder/${boardId}`, { newOrder })
                    .then(() => {
                        setValueInput('');
                        setIsShowAddList(false);
                    })
                    .catch(error => {
                        console.error('Failed to update column order:', error);
                    });
            })
            .catch(error => {
                console.error('Error adding new column:', error);
            });
    };

    return (
        <div className="board-columns">
            {columns.length > 0 &&
                <Container
                    orientation="horizontal"
                    onDrop={onColumnDrop}
                    getChildPayload={index => {
                        const column = columns[index];
                        return { id: column.id, cards: column.cards };
                    }}
                    dragHandleSelector=".column-drag-handle"
                    dropPlaceholder={{
                        animationDuration: 150,
                        showOnTop: true,
                        className: 'column-drop-preview'
                    }}
                >
                    {columns.map(column => (
                        <Draggable key={column.id}>
                            <Column
                                column={column}
                                onCardDrop={(dropResult) => onCardDrop(dropResult, column.id)}
                            />
                        </Draggable>
                    ))}
                </Container>
            }

            {isShowAddList ?
                <div className='content-add-column'>
                    <input
                        type='text'
                        className='form-control'
                        ref={inputRef}
                        value={valueInput}
                        onChange={(event) => setValueInput(event.target.value)}
                    />
                    <div className='group-btn'>
                        <button className='btn btn-success' onClick={handleAddList}>Add list</button>
                        <i className='fa fa-times icon' style={{ color: "gray" }} onClick={() => setIsShowAddList(false)}></i>
                    </div>
                </div>
                :
                <div className='add-new-column' onClick={() => setIsShowAddList(true)}>
                    <i className='fa fa-plus icon'></i>Add another column
                </div>
            }
        </div>
    );
};

export default BoardContent;
