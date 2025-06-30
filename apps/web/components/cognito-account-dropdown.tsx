'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@kit/ui/dropdown-menu';

import { Avatar, AvatarFallback, AvatarImage } from '@kit/ui/avatar';
import { Button } from '@kit/ui/button';

export function CognitoAccountDropdown({
  onSignOut,
}: {
  onSignOut: () => void;
}) {
  // In a real app, you would get user info from the decoded id_token
  const user = {
    name: 'User',
    email: 'user@example.com',
    picture: '',
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={user.picture} />
            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
          </Avatar>
          <span>{user.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 