import { useState } from 'react';
import { toast } from 'react-toastify';

const RequestForm = ({ messages, setMessages, totalRequests, setTotalRequests }) => {
  const [loading, setLoading] = useState(false);
  const [{ message, stream }, setFormState] = useState({
    message: '',
    stream: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormState((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (totalRequests === 0) {
        setFormState((prev) => ({ ...prev, message: '' }));
        throw new Error('You have reached the maximum number of requests.');
      }

      // TODO: Enter POST request here

      if (stream) {
        //  TODO (optionally): handle streamed response
      } else {
        // TODO: handle *normal* response
      }
      setTotalRequests((prev) => prev - 1);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className='label cursor-pointer flex justify-end gap-2'>
        <span className='label-text'>Stream response?</span>
        <input type='checkbox' name='stream' checked={stream} onChange={handleChange} className='checkbox' />
      </label>
      <div className='flex items-center gap-2'>
        <textarea
          name='message'
          value={message}
          rows='2'
          onChange={handleChange}
          placeholder='Ask me anything...'
          className='w-full textarea textarea-bordered'
          disabled={loading}
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
