import React, { useMemo, useState } from "react";
import useFetch from "../hooks/useFetch";
import { ClipLoader } from "react-spinners";
import { DragDropContext } from "react-beautiful-dnd";
import { Stage } from "../components/Stage";
import styled from "styled-components";
import useWebSocket from "../hooks/useWebsocket";
import { toast } from "react-toastify";

const Container = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;

const Kanban = () => {
  const { data, loading, error, setData } = useFetch(
    "http://localhost:8000/stages/"
  );
  const { isConnected, sendMessage } = useWebSocket(
    "ws://localhost:8000/ws/",
    (data) => handleMessageReceived(data)
  );

  const handleMessageReceived = (data) => {
    switch (data.type) {
      case "lead_created":
        handleLeadCreated(data.lead);
        break;
      case "lead_updated":
        handleLeadUpdated(data.lead);
        break;
      case "lead_moved":
        toast.success("Moved successfully.");
        break;
    }
  };

  const handleLeadCreated = (newLead) => {
    setData((prevData) => {
      // Make a shallow copy of the data
      const newData = [...prevData];

      // Get the first stage
      const firstStage = newData[0];

      // Create a new lead ensuring its stage is set to the first stage's id
      const leadToAdd = { ...newLead, stage: firstStage.id };

      // Append the new lead to the first stage's leads array
      newData[0] = { ...firstStage, leads: [...firstStage.leads, leadToAdd] };

      return newData;
    });
  };

  const handleLeadUpdated = (updatedLead) => {
    setData((prevData) => {
      // Iterate through each stage to find and update the lead
      const newData = prevData.map((stage) => {
        // Check if the lead exists in this stage
        const leadIndex = stage.leads.findIndex(
          (lead) => lead.id === updatedLead.id
        );

        // If the lead is found, update it
        if (leadIndex !== -1) {
          const updatedLeads = stage.leads.map((lead) =>
            lead.id === updatedLead.id ? { ...lead, ...updatedLead } : lead
          );
          return { ...stage, leads: updatedLeads };
        }

        // Otherwise, return the stage as is
        return stage;
      });

      return newData;
    });
  };

  const handleDragEnd = (result) => {
    if (!isConnected) {
      toast.error("Websocket is not connected");
      return;
    }
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (source.droppableId == destination.droppableId) return;

    const newData = Array.from(data);

    // Find the index of the source stage using the droppableId
    const sourceStageIndex = newData.findIndex(
      (stage) => stage.id.toString() === source.droppableId
    );
    console.log("stage index", sourceStageIndex);

    // Find the index of the destination stage
    const destStageIndex = newData.findIndex(
      (stage) => stage.id.toString() === destination.droppableId
    );

    // Copy the leads array from the source stage
    const sourceLeads = Array.from(newData[sourceStageIndex].leads);

    // Remove the dragged lead from the source leads array
    const [draggedLead] = sourceLeads.splice(source.index, 1);

    // Update the lead's stage property if it's being moved to a different stage
    if (source.droppableId !== destination.droppableId) {
      draggedLead.stage = Number(newData[destStageIndex].id);
    }

    // Update the source stage's leads array
    newData[sourceStageIndex].leads = sourceLeads;

    // Copy the destination stage's leads array and insert the dragged lead at the destination index
    const destLeads = Array.from(newData[destStageIndex].leads);
    destLeads.splice(destination.index, 0, draggedLead);
    newData[destStageIndex].leads = destLeads;

    // Send websocket message
    sendMessage({
      type: "move_lead",
      lead_id: draggableId,
      new_stage_id: destination.droppableId,
    });

    // Update your state with the new data
    setData(newData);
  };
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <h1>Kanban Board</h1>
      <Container>
        {loading && <ClipLoader size={32} />}
        {Boolean(data) &&
          data.map((stage) => (
            <Stage
              id={stage.id}
              key={stage.id}
              leads={stage.leads}
              title={stage.name}
              color={stage.color}
            />
          ))}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </Container>
    </DragDropContext>
  );
};

export default Kanban;
