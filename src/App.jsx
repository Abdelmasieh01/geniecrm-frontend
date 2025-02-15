import { Routes, Route } from "react-router-dom";
import Form from "./pages/Form";
import Kanban from "./pages/Kanban";
import EditForm from "./pages/EditForm";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/kanban" element={<Kanban />} />
        <Route path="/:id" element={<EditForm />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} theme="dark" />
    </>
  );
}

export default App;
