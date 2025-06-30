'use client';

import { useCallback } from 'react';

import type { Provider } from '@supabase/supabase-js';

import { useSignInWithProvider } from '@kit/supabase/hooks/use-sign-in-with-provider';
import { If } from '@kit/ui/if';
import { LoadingOverlay } from '@kit/ui/loading-overlay';
import { Trans } from '@kit/ui/trans';

import { AuthErrorAlert } from './auth-error-alert';
import { AuthProviderButton } from './auth-provider-button';

/**
 * @name OAUTH_SCOPES
 * @description
 * The OAuth scopes are used to specify the permissions that the application is requesting from the user.
 *
 * Please add your OAuth providers here and the scopes you want to use.
 *
 * @see https://supabase.com/docs/guides/auth/social-login
 */
const OAUTH_SCOPES: Partial<Record<Provider, string>> = {
  azure: 'email',
  // add your OAuth providers here
};

export function OauthProviders(props: {
  shouldCreateUser: boolean;
  enabledProviders: Provider[];

  paths: {
    callback: string;
    returnPath: string;
  };
}) {
  const signInWithProviderMutation = useSignInWithProvider();

  // we make the UI "busy" until the next page is fully loaded
  const loading = signInWithProviderMutation.isPending;

  const onSignInWithProvider = useCallback(
    async (signInRequest: () => Promise<unknown>) => {
      const credential = await signInRequest();

      if (!credential) {
        return Promise.reject(new Error('Failed to sign in with provider'));
      }
    },
    [],
  );

  const enabledProviders = props.enabledProviders;

  if (!enabledProviders?.length) {
    return null;
  }

  return (
    <>
      <If condition={loading}>
        <LoadingOverlay />
      </If>

      <div className={'flex w-full flex-1 flex-col space-y-3'}>
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
                    const clientId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_WEB_CLIENT_ID || '';
                    const redirectUri = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_IN || '';
                    const loginUrl = `${domain}/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&identity_provider=Google&scope=openid+profile+email`;
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

        <AuthErrorAlert error={signInWithProviderMutation.error} />
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
