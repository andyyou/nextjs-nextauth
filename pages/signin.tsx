import { GetServerSideProps } from 'next';
import { getProviders, signIn } from 'next-auth/react';


// https://next-auth.js.org/configuration/pages
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const providers = await getProviders();
  return {
    props: {
      providers,
      callbackUrl: query.callbackUrl
    }
  };
};

// FIXME: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/49431
// FIXME: https://github.com/nextauthjs/next-auth/issues/834
export default function SignIn({ providers, callbackUrl }: {
  providers: {
    [key: string]: {
      id: string;
      name: string;
      signinUrl: string;
    }
  },
  callbackUrl: string;
}) {
  return (
    <div>
      Sign In
      <div>
        {Object.values(providers).map((provider) => (
          <button type="button" onClick={() => signIn(provider.id, { callbackUrl })} key={provider.id}>
            Sign in with {provider.name}
          </button>
        ))}
      </div>
      
      {/* https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/core/pages/index.ts */}
      {/* <div>
        {Object.values(providers).map((provider) => (
          <div key={provider.id}>
            <form action={provider.signinUrl} method="POST">
              {callbackUrl && (
                <input type="hidden" name="callbackUrl" value={callbackUrl} />
              )}
              <button type="submit">
                Sign in with {provider.name}
              </button>
            </form>
          </div>
        ))}
      </div> */}
    </div>
  )
}