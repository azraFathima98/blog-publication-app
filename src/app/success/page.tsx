'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/'); 
    }, 3000); 

    return () => clearTimeout(timer); 
  }, [router]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>✅ Payment Successful</h1>
      <p>Thank you for your payment. You now have access to premium content!</p>
      <p style={{ marginTop: '1rem', color: 'gray' }}>
        Redirecting to homepage...
      </p>
    </div>
  );
}
