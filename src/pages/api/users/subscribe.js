// src/pages/api/users/subscribe.js
import {subscribeToNewsletter} from '@/lib/email';

export default async function handler(req, res) {
 try {

   const { email } = req.body;
   
   if (!email) {
     return res.status(400).json({
       success: false,
       message: 'Email is required'
     });
   }

   const result = await subscribeToNewsletter(email);

   return res.json(result);

 } catch (error) {
   console.error('Subscription error:', error);
   
   // Handle specific error cases
   if (error.response?.status === 400) {
     return res.status(400).json({
       success: false,
       message: 'Invalid email address'
     });
   }

   // Generic error response
   return res.status(500).json({
     success: false,
     message: 'An error occurred while processing your subscription'
   });
 }
}
