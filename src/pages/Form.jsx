import React, { useRef } from "react";
import useWebSocket from "../hooks/useWebsocket";
import { toast } from "react-toastify";
import { Container, Button, Input, TextArea, Form } from "../components/styled";


const FormPage = () => {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const notesRef = useRef();
  const formRef = useRef();

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
      type: "create_lead",
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
      formRef.current.reset();
      toast.success("Created successfully!");
    }
  };

  return (
    <Container>
      <div>
        <h1>Add a new lead</h1>
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
      </div>
    </Container>
  );
};

export default FormPage;
