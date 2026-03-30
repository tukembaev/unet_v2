import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback, Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, Skeleton } from "shared/ui";
import { useEmployeeDetails } from "entities/user";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { ApprovalParticipant } from "./DocumentApprovalFlow";

interface ApprovalUserTooltipProps {
  userId: string;
  participant: ApprovalParticipant;
  index: number;
  allParticipants: ApprovalParticipant[];
  children: React.ReactNode;
}

const ApprovalUserTooltipSkeleton = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
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
      </div>

      <div className="space-y-2 border-t pt-3">
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
};

const ApprovalUserTooltip = ({ userId, participant, index, allParticipants, children }: ApprovalUserTooltipProps) => {
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

  const getApprovalStatus = () => {
    if (participant.isSigned) {
      return {
        icon: <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />,
        text: "Подписано",
        className: "text-green-600 dark:text-green-400"
      };
    }
    
    if (participant.rejectionReason) {
      return {
        icon: <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />,
        text: "Отклонено",
        className: "text-red-600 dark:text-red-400",
        reason: participant.rejectionReason
      };
    }
    
    const allPreviousSigned = index === 0 || allParticipants.slice(0, index).every(p => p.isSigned);
    return {
      icon: <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />,
      text: allPreviousSigned ? "На подписании" : "Ожидает",
      className: "text-blue-600 dark:text-blue-400"
    };
  };

  const status = getApprovalStatus();

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[320px] p-4">
          {isLoading ? (
            <ApprovalUserTooltipSkeleton />
          ) : employee ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={employee.avatar_url || participant.photo || undefined} alt={employee.full_name} />
                  <AvatarFallback className="text-xs">
                    {getInitials(employee.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-sm pb-1">{employee.full_name}</p>
                  <div className="flex items-center gap-1">
                  {status.icon}
                  {status.reason ? (
                  <div className="flex-1">
                    <p className={`text-xs font-medium ${status.className}`}>{status.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{status.reason}</p>
                  </div>
                ) : (
                  <span className={`text-xs font-medium ${status.className}`}>{status.text}</span>
                )}
                </div>
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

export default ApprovalUserTooltip;
