import {
  BorderedNavigationMenu,
  BorderedNavigationMenuItem,
} from '@kit/ui/bordered-navigation-menu';

import { AppLogo } from '~/components/app-logo';
import { navigationConfig } from '~/config/navigation.config';

export function HomeMenuNavigation() {
  const routes = navigationConfig.routes.reduce<
    Array<{
      path: string;
      label: string;
      Icon?: React.ReactNode;
      end?: boolean | ((path: string) => boolean);
    }>
  >((acc, item) => {
    if ('children' in item) {
      return [...acc, ...item.children];
    }

    if ('divider' in item) {
      return acc;
    }

    return [...acc, item];
  }, []);

  return (
    <div className={'flex w-full flex-1 items-center space-x-8'}>
      <AppLogo />

      <BorderedNavigationMenu>
        {routes.map((route) => (
          <BorderedNavigationMenuItem {...route} key={route.path} />
        ))}
      </BorderedNavigationMenu>
    </div>
  );
}
