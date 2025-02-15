import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  margin: auto;
`;

const Button = styled.button`
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;

  &:hover {
    border-color: #646cff;
  }

  &:focus,
  &:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
`;
const Input = styled.input`
  width: 100%;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-family: inherit;
  border-radius: 8px;
  border: 1px solid #333;
  background-color: #1a1a1a;
  color: #fff;
  transition: border-color 0.25s;

  &:focus {
    border-color: #646cff;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 50px;
  resize: vertical;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-family: inherit;
  border-radius: 8px;
  border: 1px solid #333;
  background-color: #1a1a1a;
  color: #fff;
  transition: border-color 0.25s;

  &:focus {
    border-color: #646cff;
    outline: none;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.8em;
  max-width: 400px;
  width: 100%;
`;

export { Container, Button, Input, TextArea, Form };
