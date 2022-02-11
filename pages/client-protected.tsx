import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import AccessDenied from '../components/AccessDenied';
import Link from 'next/link';

export default function Page() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const [content, setContent] = useState();

  useEffect(() => {
    const exec = async () => {
      const res = await fetch('/api/protected');
      const json = await res.json();
      if (json.content) {
        setContent(json.content);
      }
    }
    exec();
  }, [session]);

  if (typeof window !== 'undefined' && isLoading) {
    return null;
  }
  console.log('content', content);
  if (!session) {
    return (
      <AccessDenied />
    )
  }

  return (
    <>
      <h1>Protected Page</h1>
      <strong>{content || 'Good!'}</strong>
      <Link href="/">
        <a>
          Home
        </a>
      </Link>
    </>
  )
};