import { useState } from 'react';
import { toast } from 'react-toastify';

const RequestForm = ({ messages, setMessages, totalRequests, setTotalRequests }) => {
  const [loading, setLoading] = useState(false);

  // TODO: add state and change handler to control form elements
  const [formState, setFormState] = useState({
    message: '',
    stream: false,
  });

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      // if (totalRequests === 0) {
      //   setFormState((prev) => ({ ...prev, message: '' }));
      //   throw new Error('You have reached the maximum number of requests.');
      // }
      // TODO: Enter POST request here
      setLoading(true);
      // add new message to messages state
      if (!formState.message) throw new Error('No Message entered!');

      const newMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: formState.message,
      };
      setMessages((prev) => [...prev, newMessage]);

      // issue post to http://localhost:5050/api/v1/chat/completions

      const body = {
        model: 'gpt-4o',
        messages: [...messages, newMessage],
        stream: formState.stream,
      };

      const res = await fetch('http://localhost:5050/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          provider: 'open-ai',
          mode: 'development',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (formState.stream) {
        //  TODO (optionally): handle streamed response

        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        const newMessageID = crypto.randomUUID();

        let result = false;

        while (!(result = await reader.read()).done) {
          const chunk = decoder.decode(result.value, { stream: true });
          const lines = chunk.split('\n');
          lines.forEach((line) => {
            if (line.startsWith('data: ')) {
              const jsonStr = line.replace('data:', '');
              const data = JSON.parse(jsonStr);
              console.log(data);
              const content = data.choices[0]?.delta?.content;

              if (content) {
                setMessages((prev) => {
                  const isMessageAlreadyAdded = prev.find((m) => m.id === newMessageID);
                  if (isMessageAlreadyAdded) {
                    return prev.map((m) => (m.id === newMessageID ? { ...m, content: m.content + content } : m));
                  }

                  return [...prev, { id: newMessageID, role: 'assistant', content }];
                });
              }
            }
          });
        }
      } else {
        // TODO: handle *normal* response
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            ...data.message,
            id: crypto.randomUUID(),
          },
        ]);
      }

      // setFormState((prev) => ({ ...prev, message: '' }));
      setFormState({ stream: formState.stream, message: '' });
      setTotalRequests((prev) => prev - 1);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // TODO: control the input elements in this form with React State
  return (
    <form onSubmit={handleSubmit}>
      <label className='label cursor-pointer flex justify-end gap-2'>
        <span className='label-text'>Stream response?</span>
        <input
          type='checkbox'
          name='stream'
          className='checkbox'
          checked={formState.stream}
          onChange={(e) => setFormState((prev) => ({ ...prev, stream: e.target.checked }))}
        />
      </label>
      <div className='flex items-center gap-2'>
        <textarea
          name='message'
          rows='2'
          placeholder='Ask me anything...'
          className='w-full textarea textarea-bordered'
          disabled={loading}
          value={formState.message}
          onChange={(e) => setFormState((prev) => ({ ...prev, message: e.target.value }))}
        ></textarea>
        <button type='submit' className='btn btn-primary btn-circle' disabled={loading}>
          {loading ? (
            <span className='loading loading-spinner'></span>
          ) : (
            <span role='img' aria-label='sparkles'>
              ✨
            </span>
          )}
        </button>
      </div>
    </form>
  );
};

export default RequestForm;
