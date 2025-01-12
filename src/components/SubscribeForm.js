'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function SubscribeForm() {
  const { data: session, status } = useSession();
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const onTurnstileSuccess = (token) => {
    setTurnstileToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const email = e.target.email.value;
      if (!turnstileToken) {
        setMessage({ type: 'error', text: 'Please complete the security check.' });
        return;
      }

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
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ui container my-4 py-4 mobile-margin-none">
      <div className="row w-full">
        <div className="col-12 flex justify-center items-center">
          <Image
            width={500}
            height={100}
            priority={false}
            className="banner-image" 
            src="/img/sub-text.png" 
            alt="subscribe banner"
          />
        </div>
      </div>

      <form id="subscribeForm" className="flex justify-center form-custom flex-column" onSubmit={handleSubmit}>
        <div className="ui action input m-0 p-0" style={{ border: '2px solid #FFD700', borderRadius: '5px', overflow: 'hidden' }}>
          {status === 'loading' ? (
            <div className="animate-pulse bg-gray-200" style={{ width: '17rem', height: '41px' }} />
          ) : (
            <input 
              type="email" 
              placeholder={session?.user?.email || 'You look new :)'} 
              defaultValue={session?.user?.email || ''} 
              name="email" 
              id="email" 
              style={{ width: '17rem', border: 'none', padding: '10px' }} 
              required
              disabled={isSubmitting}
            />
          )}
          <button 
            type="submit" 
            className={`ui button yellow text-dark ${isSubmitting ? 'loading' : ''}`}
            style={{ padding: '10px 20px' }}
            disabled={isSubmitting}
          >
            <i className="fas fa-paper-plane mr-2"></i>
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
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