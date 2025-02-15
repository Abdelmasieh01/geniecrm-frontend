import { useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import useWebSocket from "../hooks/useWebsocket";
import { toast } from "react-toastify";
import useFetch from "../hooks/useFetch";
import { ClipLoader } from "react-spinners";
import { Container, Button, Input, TextArea, Form } from "../components/styled";

const EditForm = () => {
  const { id } = useParams();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const notesRef = useRef();
  const formRef = useRef();

  const { data, loading, error } = useFetch(
    `http://localhost:8000/leads/${id}/`
  );

  useEffect(() => {
    if (data) {
      firstNameRef.current.value = data?.first_name;
      lastNameRef.current.value = data?.last_name;
      emailRef.current.value = data?.email;
      phoneRef.current.value = data?.phone;
      notesRef.current.value = data?.notes;
    }
  }, [data]);

  const { isConnected, sendMessage } = useWebSocket(
    "ws://localhost:8000/ws/",
    (data) => handleMessage(data)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !firstNameRef.current.value ||
      !lastNameRef.current.value ||
      !emailRef.current.value
    ) {
      toast.error("Please fill required fields!");
      return;
    }
    const data = {
      type: "update_lead",
      lead_id: id,
      first_name: firstNameRef.current.value,
      last_name: lastNameRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
      notes: notesRef.current.value,
    };
    sendMessage(data);
  };

  const handleMessage = (data) => {
    // console.log(data);
    if (data["type"] == "error") toast.error(data.message);
    else {
      toast.success("Updated successfully!");
    }
  };

  return (
    <Container>
      <div>
        <h1>Lead with Id: {id}</h1>
        {loading && <ClipLoader size={32} />}
        {data && (
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="First Name"
              ref={firstNameRef}
              required
            />
            <Input
              type="text"
              placeholder="Last Name"
              ref={lastNameRef}
              required
            />
            <Input type="text" placeholder="Email" ref={emailRef} required />
            <Input type="text" placeholder="Phone" ref={phoneRef} />
            <TextArea type="text" placeholder="Notes" ref={notesRef} />
            <Button type="submit">Submit</Button>
          </Form>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </Container>
  );
};

export default EditForm;
