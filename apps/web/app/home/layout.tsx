'use client';

import { HomeMenuNavigation } from './_components/home-menu-navigation';
import { AppLogo } from '../../components/app-logo';
import { CognitoAccountDropdown } from '../../components/cognito-account-dropdown';
import { useSignOut } from '../../hooks/use-sign-out';

function HomeLayout({ children }: React.PropsWithChildren) {
  const signOut = useSignOut();

  return (
    <div className={'flex h-full flex-col'}>
      <div className="flex flex-1">
        <div className={'hidden h-full w-[18rem] flex-col space-y-4 border-r md:flex'}>
          <div className={'flex items-center space-x-2 border-b px-4 py-2.5'}>
            <AppLogo />
          </div>

          <div className={'px-4'}>
            <HomeMenuNavigation />
          </div>
        </div>

        <div className="flex-1">
          <div className={'flex h-16 items-center justify-end border-b'}>
            <div className={'mr-4 flex items-center space-x-4'}>
              <CognitoAccountDropdown onSignOut={signOut} />
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

export default HomeLayout;
