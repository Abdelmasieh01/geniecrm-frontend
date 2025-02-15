import React, { useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const Container = styled.div`
  border-radius: 10px;
  padding: 2px;
  margin: 0px 2px 8px 2px;
  color: #000;
  background-color: ${(props) => props.isDragging ? "lightgreen" : "#000"};
  cursor: pointer;
  color: #fff;
`;


export default function Lead({ lead, index }) {
  return (
    <Draggable draggableId={lead.id.toString()} key={`${lead.id}`} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          <p>Name: {`${lead.first_name} ${lead.last_name}`}</p>
          <p>Email: {lead.email}</p>
          {lead.phone && <p>Phone: {lead.phone}</p>}
        </Container>
      )}
    </Draggable>
  );
}
