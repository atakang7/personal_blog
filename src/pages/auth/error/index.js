import { useRouter } from 'next/router';
import React from 'react'

export default function ErrorPage() {
  const router = useRouter();

  React.useEffect(() => {
    router.replace('/');
  }, [router]);

  return <div>Error page. Redirecting...</div>;
}

