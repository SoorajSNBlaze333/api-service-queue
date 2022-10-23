import { useEffect, useState } from "react";
import Button from "./components/Button";
import api from "./libs/api";

const App = () => {
  const [counter, setCounter] = useState(0);
  const [online, setOnline] = useState(navigator.onLine??false);

  const handleClick = (method = 'get') => {
    setCounter(prev => prev + 1);
    let request = api.get;
    if (method === 'post') request = api.post;
    else if (method === 'put') request = api.put;
    else if (method === 'delete') request = api.delete;

    return request()
      .then((data) => {
        console.log(data);
        setCounter(prev => prev - 1)
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    setInterval(() => {
      setOnline(navigator.onLine??false);
    }, 2000);
  }, []);

  const renderNetworkStatus = () => {
    if (online) {
      return <div className="flex justify-center items-center border-2 border-green-500 bg-green-50 rounded-full px-2">
        <div className="h-2 w-2 bg-green-500 rounded-full mr-1" />
        <div className="text-green-500 text-xs font-semibold mb-[0.5px]">online</div>
      </div>
    }
    return <div className="flex justify-center items-center border-2 border-red-500 bg-red-50 rounded-full px-2">
      <div className="h-2 w-2 bg-red-400 rounded-full mr-1" />
      <div className="text-red-500 text-xs font-semibold mb-[0.5px]">offline</div>
    </div>
  }

  return (
    <div className="h-full w-full flex justify-center items-center flex-col">
      <div className="text-3xl my-2">Requests in Queue: {counter}</div>
      <Button onClick={() => handleClick('get')}>Make get request</Button>
      <Button onClick={() => handleClick('post')}>Make post request</Button>
      <Button onClick={() => handleClick('put')}>Make put request</Button>
      <Button onClick={() => handleClick('delete')}>Make delete request</Button>
      <div className="absolute bottom-3">{renderNetworkStatus()}</div>
    </div>
  );
}

export default App;
