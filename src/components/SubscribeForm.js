'use client';
import { useState } from 'react';

export default function SubscribeForm({ user }) {
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const onTurnstileSuccess = (token) => {
    setTurnstileToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const email = e.target.email.value;
      // Validate Turnstile first
      if (!turnstileToken) {
        setMessage({ type: 'error', text: 'Please complete the security check.' });
        return;
      }


      // Validate with Turnstile
      const validateResponse = await fetch('/api/users/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          'cf-turnstile-response': turnstileToken
        })
      });

      if (!validateResponse.ok) {
        throw new Error('Security validation failed');
      }

      // Subscribe the user
      const subscribeResponse = await fetch('/api/users/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const result = await subscribeResponse.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Successfully subscribed!' });
        // Reload after a short delay to show success message
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setMessage({ type: 'error', text: result.message || 'Subscription failed. Please try again.' });
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setMessage({ 
        type: 'error', 
        text: 'An error occurred. Please try again later.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ui container my-4 py-4 mobile-margin-none">
      {!user?.isSubscribed ? (
        <div className="row w-full">
          <div className="col-12 mt-5 flex justify-center items-center">
            <img 
              className="banner-image" 
              src="/img/sub-text.png" 
              alt="Hi there banner."
              loading="lazy"
            />
          </div>
        </div>
      ) : (
        <div className="ui container flex justify-center before">
          <h1 className="text-center w-100 text-3xl mt-4 ubuntu-light" style={{ fontSize: '2rem' }}>
            Welcome back my friend :)
          </h1>
        </div>
      )}

      <form id="subscribeForm" className="flex justify-center form-custom flex-column" onSubmit={handleSubmit}>
        <div className="ui action input m-0 p-0" style={{ border: '2px solid #FFD700', borderRadius: '5px', overflow: 'hidden' }}>
          <input 
            type="email" 
            placeholder={user.email} 
            defaultValue={user.email} 
            name="email" 
            id="email" 
            style={{ width: '17rem', border: 'none', padding: '10px' }} 
            required
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className={`ui button yellow text-dark ${isLoading ? 'loading' : ''}`}
            style={{ padding: '10px 20px' }}
            disabled={isLoading}
          >
            <i className="fas fa-paper-plane mr-2"></i>
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>

        {message && (
          <div className={`ui message ${message.type === 'error' ? 'error' : 'success'} mt-4`}>
            {message.text}
          </div>
        )}

        <div 
          className="cf-turnstile mt-4" 
          data-sitekey="0x4AAAAAAAxGmcDVTClpwzCZ" 
          data-callback="onTurnstileSuccess"
        />
      </form>
    </div>
  );
}