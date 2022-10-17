import { useState } from "react";
import Button from "./components/Button";
import api from "./libs/api";

const App = () => {
  const [counter, setCounter] = useState(0);

  const handleClick = () => {
    console.log('Clicked Button');
    return api.get('/')
      .then(() => setCounter(prev => prev + 1))
      .catch((error) => console.log(error));
  }

  return (
    <div className="h-full w-full flex justify-center items-center flex-col">
      <div className="text-3xl my-2">Counter: {counter}</div>
      <Button onClick={handleClick}>Make Get request</Button>
    </div>
  );
}

export default App;
