import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from 'shared/ui';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'shared/ui';
import { translateRole, getRoleIcon, getRoleColors } from 'shared/lib/role-translations';

interface AvatarGroupProps {
  members: Array<{
    user_id: string;
    user_name: string;
    role: string;
    avatar_url: string;
    is_online: boolean;
  }>
  max?: number;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ members, max = 3 }) => {
  const visibleMembers = members.slice(0, max);
  const remainingCount = members.length - max;

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale cursor-pointer relative z-10">
            {visibleMembers.map((member) => {
              
              return (
                <Avatar key={member.user_id} data-slot="avatar" className="h-8 w-8">
                  <AvatarImage src={member.avatar_url} alt={member.user_name} className="object-cover" />
                  <AvatarFallback className="text-xs">
                    {member.user_name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              );
            })}
            
            {remainingCount > 0 && (
              <Avatar data-slot="avatar" className="h-8 w-8">
                <AvatarFallback className="text-xs font-medium">
                  +{remainingCount}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="z-[9999] p-3 min-w-[200px]">
          <div className="space-y-3">
            <div className="font-semibold text-sm text-gray-900">Участники задачи</div>
            <div className="space-y-2">
              {members.map((member) => {
                const RoleIcon = getRoleIcon(member.role);
                const colors = getRoleColors(member.role);
                
                return (
                  <div key={member.user_id} className="flex items-center gap-3 py-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar_url} alt={member.user_name} className="object-cover" />
                      <AvatarFallback className="text-sm font-medium">
                        {member.user_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">{member.user_name}</div>
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${colors.bg} ${colors.text} ${colors.border} border`}>
                        {RoleIcon && <RoleIcon className="h-3 w-3" />}
                        {translateRole(member.role)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
