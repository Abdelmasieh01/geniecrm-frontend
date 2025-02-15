import React, { useEffect } from "react";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import Lead from "./Lead";

const Container = styled.div`
  background-color: #1a1a1a;
  border-radius: 2.5px;
  width: 300px;
  height: 500px;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  border: 1px solid #333;
`;

const Title = styled.h1`
  background-color: #646cff;
  font-size: 32px;
  padding: 3px;
`;

const LeadList = styled.div`
  padding: 3px;
  transition: background-color 0.2s ease;
  min-height: 400px;
`;

export const Stage = ({ title, leads, id, color }) => {
  return (
    <Container>
      <Title style={{ backgroundColor: color }}>{title}</Title>

      <Droppable droppableId={id.toString()} isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
        {(provided, snapshot) => (
          <LeadList
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {leads.map((lead, index) => (
              <Lead lead={lead} index={index} key={index} />
            ))}
            {provided.placeholder}
          </LeadList>
        )}
      </Droppable>
    </Container>
  );
};
