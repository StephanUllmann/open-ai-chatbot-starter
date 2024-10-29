import { useState } from 'react';
import { toast } from 'react-toastify';

const RequestForm = ({ messages, setMessages, totalRequests, setTotalRequests }) => {
  const [loading, setLoading] = useState(false);

  // TODO: add state and change handler to control form elements

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

  // TODO: control the input elements in this form with React State
  return (
    <form onSubmit={handleSubmit}>
      <label className='label cursor-pointer flex justify-end gap-2'>
        <span className='label-text'>Stream response?</span>
        <input type='checkbox' name='stream' className='checkbox' />
      </label>
      <div className='flex items-center gap-2'>
        <textarea
          name='message'
          rows='2'
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
