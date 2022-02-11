import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const {
    data: session,
    status
  } = useSession();
  const isLoading = status === 'loading';
  console.log('session', session);

  return (
    <>
      {!session && (
        <>
          <span>Yo are not signed in</span>
          <a
            href="/api/auth/signin" 
            onClick={(e) => {
              e.preventDefault();
              signIn();
            }}
          >
            Sign In
          </a>
        </>
      )}
      {session?.user && (
        <>
          <span>Signed in as {session.user.email}({session.user.name})</span>
          <a 
            href="/api/auth/signout"
            onClick={(e) => {
              e.preventDefault();
              signOut();
            }}
          >
            Sign Out
          </a>
          <div>
            <Link href="/client-protected">
              <a>
                Protected page by client
              </a>
            </Link>
          </div>
          <div>
            <Link href="/ssr-protected">
              <a>
                Protected page by ssr
              </a>
            </Link>
          </div>
        </>
      )}
    </>
  )
}
