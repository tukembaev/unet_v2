import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from 'shared/ui';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'shared/ui';

interface AvatarGroupProps {
  members: Array<{
    id: number;
    member: {
      id: number;
      first_name: string;
      surname: string;
      short_name: string;
      imeag: string;
    } | null;
    member_type: string;
  }>;
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
              if (!member.member) return null;
              
              return (
                <Avatar key={member.id} data-slot="avatar" className="h-8 w-8">
                  <AvatarImage src={member.member.imeag} alt={member.member.short_name} className="object-cover" />
                  <AvatarFallback className="text-xs">
                    {member.member.short_name.split(' ').map(n => n[0]).join('')}
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
              {members.map((member) => (
                <div key={member.id} className="flex items-center gap-3 py-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.member?.imeag} alt={member.member?.short_name} className="object-cover" />
                    <AvatarFallback className="text-sm font-medium">
                      {member.member?.short_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate">{member.member?.short_name}</div>
                    <div className="text-xs text-gray-500 truncate">{member.member_type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
