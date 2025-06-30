'use client';

import { Trans } from '@kit/ui/trans';

import { AuthProviderButton } from './auth-provider-button';

export function OauthProviders(props: {
  shouldCreateUser: boolean;
  enabledProviders: string[];

  paths: {
    callback: string;
    returnPath: string;
  };
}) {
  const enabledProviders = props.enabledProviders;

  if (!enabledProviders?.length) {
    return null;
  }

  return (
    <>
      <div className={'flex-col space-y-2'}>
        {enabledProviders.map((provider) => {
          // Custom logic for Google via Cognito
          if (provider === 'google') {
            return (
              <AuthProviderButton
                key={provider}
                providerId={provider}
                onClick={() => {
                  const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN || '';
                  const clientId =
                    process.env.NEXT_PUBLIC_COGNITO_USER_POOL_WEB_CLIENT_ID || '';
                  const redirectUri =
                    process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_IN || '';
                  const loginUrl = `${domain}/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
                    redirectUri,
                  )}&identity_provider=Google&scope=openid+profile+email`;
                  window.location.href = loginUrl;
                }}
              >
                <Trans
                  i18nKey={'auth:signInWithProvider'}
                  values={{
                    provider: getProviderName(provider),
                  }}
                />
              </AuthProviderButton>
            );
          }
          // Optionally, hide other providers or keep default logic
          return null;
        })}
      </div>
    </>
  );
}

function getProviderName(providerId: string) {
  const capitalize = (value: string) =>
    value.slice(0, 1).toUpperCase() + value.slice(1);

  if (providerId.endsWith('.com')) {
    return capitalize(providerId.split('.com')[0]!);
  }

  return capitalize(providerId);
}
