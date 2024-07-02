import { useEffect, useRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Chat, RequestForm } from '@/components';
import 'react-toastify/dist/ReactToastify.css';

const systemPrompt = 'You are a sassy web developer';

const App = () => {
  const chatRef = useRef(null);
  const [totalRequests, setTotalRequests] = useState(0);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'system',
      content: systemPrompt
    }
  ]);

  useEffect(() => {
    chatRef.current.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages]);

  return (
    <div className='container mx-auto h-screen flex flex-col justify-around'>
      <ToastContainer theme='colored' autoClose={1000} />
      <div ref={chatRef} className='h-[70%] p-5 bg-base-200 rounded-lg shadow-md overflow-y-scroll'>
        <Chat messages={messages} />
      </div>
      <div className='h-[25%] p-5 bg-base-200 rounded-lg shadow-md'>
        <RequestForm
          messages={messages}
          setMessages={setMessages}
          totalRequests={totalRequests}
          setTotalRequests={setTotalRequests}
        />
      </div>
    </div>
  );
};

export default App;
