import { useState } from 'react';
import { toast } from 'react-toastify';

const promptObj = {
  model: 'dall-e-3',
  n: 1,
  size: '1024x1024',
  response_format: 'b64_json',
};

const Settings = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const body = { ...promptObj, prompt };

      const res = await fetch('http://localhost:5050/api/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          provider: 'open-ai',
          mode: 'production',
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Promting failed');

      const data = await res.json();
      console.log(data);
      setImage(data[0].b64_json);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='h-[75%] p-5 bg-base-200 rounded-lg shadow-md overflow-y-scroll'>
        {image && (
          <a href={`data:image/png;base64,${image}`} download={'generatedimg.png'}>
            {' '}
            <img className='h-full' src={`data:image/png;base64,${image}`} alt='' />
          </a>
        )}
      </div>
      <div className='h-[20%] p-5 bg-base-200 rounded-lg shadow-md'>
        <form onSubmit={handleSubmit}>
          <div className='flex items-center gap-2'>
            <textarea
              name='prompt'
              rows='2'
              placeholder='Prompt for an avatar'
              className='w-full textarea textarea-bordered'
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              disabled={loading}
            ></textarea>
            <button type='submit' className='btn btn-primary btn-circle disabled:grayscale-0' disabled={loading}>
              <span role='img' aria-label='sparkles'>
                ✨
              </span>
            </button>
          </div>
        </form>
        {image && (
          <button className='btn btn-primary' onClick={() => localStorage.setItem('avatar', image)}>
            Save Avatar
          </button>
        )}
      </div>
    </div>
  );
};

export default Settings;
