import { GetServerSideProps } from 'next';
import type { Session } from 'next-auth';
import { useSession, getSession } from 'next-auth/react';
import AccessDenied from '../components/AccessDenied';

export const getServerSideProps: GetServerSideProps<{
  session: Session | null
}> = async (context) => {
  return {
    props: {
      session: await getSession(context)
    }
  };
};

export default function Page() {
  const { data: session, status } = useSession();
  const unauthenticated = status === 'unauthenticated';
  
  if (!session && unauthenticated) {
    return (
      <AccessDenied />
    )
  }

  return (
    <>
      SSR Protected Page
    </>
  )

}