import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback, Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, Skeleton } from "shared/ui";
import { useEmployeeDetails } from "../model/queries";

interface UserTooltipProps {
  userId: string;
  children: React.ReactNode;
}

const UserTooltipSkeleton = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      <div className="space-y-2 border-t pt-3">
        <div className="flex items-start gap-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-40" />
        </div>
        <div className="flex items-start gap-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="flex items-start gap-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      <div className="space-y-2 border-t pt-3">
        <Skeleton className="h-3 w-28" />
        <div className="space-y-1">
          <div className="flex items-start gap-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-36" />
          </div>
          <div className="flex items-start gap-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-44" />
          </div>
        </div>
      </div>
    </div>
  );
};

const UserTooltip = ({ userId, children }: UserTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: employee, isLoading } = useEmployeeDetails(userId, isOpen);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[320px] p-4">
        {isLoading ? (
          <UserTooltipSkeleton />
        ) : employee ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={employee.avatar_url || undefined} alt={employee.full_name} />
                <AvatarFallback className="text-sm">
                  {getInitials(employee.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-sm">{employee.full_name}</p>
                <p className="text-xs text-muted-foreground">@{employee.username}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs border-t pt-3">
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground min-w-[80px]">Email:</span>
                <span className="font-medium flex-1 break-all">{employee.email}</span>
              </div>
              
              {employee.phone_number && (
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground min-w-[80px]">Телефон:</span>
                  <span className="font-medium flex-1">{employee.phone_number}</span>
                </div>
              )}

              {employee.birth_date && (
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground min-w-[80px]">Дата рождения:</span>
                  <span className="font-medium flex-1">{formatDate(employee.birth_date)}</span>
                </div>
              )}
            </div>

            {employee.employee_profile?.employments && employee.employee_profile.employments.length > 0 && (
              <div className="space-y-2 border-t pt-3">
                <p className="text-xs font-semibold text-muted-foreground">Трудоустройство</p>
                {employee.employee_profile.employments
                  .filter(emp => emp.is_active)
                  .map((employment) => (
                    <div key={employment.id} className="space-y-1 text-xs">
                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground min-w-[80px]">Должность:</span>
                        <span className="font-medium flex-1">{employment.position}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground min-w-[80px]">Организация:</span>
                        <span className="font-medium flex-1">{employment.organization_name}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground min-w-[80px]">Ставка:</span>
                        <span className="font-medium flex-1">{employment.rate}</span>
                      </div>
                      {employment.start_date && (
                        <div className="flex items-start gap-2">
                          <span className="text-muted-foreground min-w-[80px]">Начало:</span>
                          <span className="font-medium flex-1">{formatDate(employment.start_date)}</span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground py-2">
            Не удалось загрузить данные
          </div>
        )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UserTooltip;
