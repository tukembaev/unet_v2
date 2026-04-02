import { useRef, useMemo, useState, useEffect } from "react";
import { AnimatedBeam, Circle, StaticLine } from "shared/components/animated-ui/AnimatedBeam";
import { Avatar, AvatarFallback, AvatarImage } from "shared/ui/avatar";
import { Button } from "shared/ui";
import { TooltipProvider } from "shared/ui/tooltip";
import { cn } from "shared/lib";
import { GitBranch, X, Check, Plus } from "lucide-react";
import ApprovalUserTooltip from "./ApprovalUserTooltip";

export type ApprovalRole = "Отправитель" | "Согласующий" | "Получатель";

export interface ApprovalParticipant {
  id: string;
  name: string;
  photo?: string;
  status:string
  isSigned: boolean;
  rejectionReason?: string;
  isCurrent?: boolean;
  type_approval: string
}

interface DocumentApprovalFlowProps {
  participants: ApprovalParticipant[];
  currentUserId?: string;
  onApprove?: () => void;
  onReject?: () => void;
  onAddMembers?: () => void;
}

const DocumentApprovalFlow = ({ 
  participants, 
  currentUserId,
  onApprove, 
  onReject,
  onAddMembers 
}: DocumentApprovalFlowProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRefsReady, setIsRefsReady] = useState(false);
  const [usersPerRow, setUsersPerRow] = useState(4);
  
  const participantRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  useEffect(() => {
    const updateUsersPerRow = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setUsersPerRow(2);
      } else if (width < 1024) {
        setUsersPerRow(3);
      } else {
        setUsersPerRow(4);
      }
    };
    
    updateUsersPerRow();
    window.addEventListener('resize', updateUsersPerRow);
    return () => window.removeEventListener('resize', updateUsersPerRow);
  }, []);

  
  const getSnakePosition = (index: number) => {
    const row = Math.floor(index / usersPerRow);
    const col = index % usersPerRow;
    const isReverseRow = row % 2 === 1;
    const actualCol = isReverseRow ? (usersPerRow - 1 - col) : col;
    return { row, col: actualCol, isReverseRow };
  };
  
  useMemo(() => {
    participantRefs.current = participantRefs.current.slice(0, participants.length);
  }, [participants.length, usersPerRow]);

  useEffect(() => {
    const checkRefs = () => {
      const allRefsReady = participantRefs.current.every(ref => ref !== null);
      if (allRefsReady && participantRefs.current.length === participants.length) {
        setIsRefsReady(true);
      }
    };

    const timer = setTimeout(checkRefs, 50);
    return () => clearTimeout(timer);
  }, [participants.length]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (participant: ApprovalParticipant, index: number) => {
    if (participant.isSigned) {
      return "border-green-500";
    }
    if (participant.rejectionReason) {
      return "border-red-500";
    }

    if (participant.status === "Доработать") {
      return "border-red-500";
    }
    const allPreviousSigned = index === 0 || participants.slice(0, index).every(p => p.isSigned);
    if (!participant.isSigned && !participant.rejectionReason && allPreviousSigned) {
      return "border-yellow-500";
    }
    return "border-gray-300";
  };

  const firstRejectedIndex = participants.findIndex((p) => p.rejectionReason);

  // Находим текущего участника (чья очередь подписывать)
  const currentParticipant = participants.find(p => p.isCurrent && p.id === currentUserId);
  const isUserTurn = !!currentParticipant;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Цепочка согласования</h3>
          
          {/* Кнопка добавления согласующих */}
          {onAddMembers && (
            <Button 
              variant="secondary"
              size="sm"
              onClick={onAddMembers}
              className="flex items-center gap-1 h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Кнопки управления - показываем только если очередь пользователя */}
        {isUserTurn && (onApprove || onReject) && (
          <div className="flex items-center gap-2">
            {onReject && (
              <Button 
                variant="destructive"
                size="sm"
                onClick={onReject}
                className="flex items-center gap-2"
              >
                <X className="h-3 w-3" />
                Отказать
              </Button>
            )}
            {onApprove && currentParticipant && (
              <Button 
                variant="default"
                size="sm"
                onClick={onApprove}
                className="flex items-center gap-2"
              >
                <Check className="h-3 w-3" />
                {currentParticipant.type_approval}
              </Button>
            )}
          </div>
        )}
      </div>
      
      <TooltipProvider delayDuration={0}>
        <div className="relative w-full" ref={containerRef}>
          <div 
            className="grid gap-x-4 sm:gap-x-8 gap-y-12 sm:gap-y-16 mx-auto w-full"
            style={{
              gridTemplateColumns: `repeat(${usersPerRow}, minmax(60px, 1fr))`,
              maxWidth: usersPerRow < 4 ? `${usersPerRow * 140}px` : 'none'
            }}
          >

            {participants.map((participant, index) => {
              const { row, col } = getSnakePosition(index);
              
              return (
                <div 
                  key={participant.id} 
                  className="relative flex flex-col items-center gap-2"
                  style={{
                    gridRow: row + 1,
                    gridColumn: col + 1,
                  }}
                >
                  <ApprovalUserTooltip
                    userId={participant.id}
                    participant={participant}
                    index={index}
                    allParticipants={participants}
                  >
                    <div>
                      <Circle
                        ref={(el) => {
                          participantRefs.current[index] = el;
                        }}
                        className={cn(
                          "transition-all  p-0 cursor-pointer hover:scale-110 w-10 h-10 sm:w-12 sm:h-12",
                          getStatusColor(participant, index)
                        )}
                      >
                        <Avatar className="size-full ">
                          <AvatarImage src={participant.photo} alt={participant.name} className="object-cover" />
                          <AvatarFallback className="text-xs size-full flex items-center justify-center">{getInitials(participant.name)}</AvatarFallback>
                        </Avatar>
                      </Circle>
                    </div>
                  </ApprovalUserTooltip>

                  <span className="text-[10px] sm:text-xs font-medium text-center max-w-[60px] sm:max-w-[80px] md:max-w-[120px] truncate">
                    {participant.status}
                  </span>
                </div>
              );
            })}
          </div>


          {isRefsReady && participants.map((participant, index) => {
            if (index >= participants.length - 1) return null;

            if (firstRejectedIndex !== -1 && index > firstRejectedIndex) {
              return null;
            }

            const nextParticipant = participants[index + 1];
            const currentPos = getSnakePosition(index);
            const nextPos = getSnakePosition(index + 1);
            
            const isRowTransition = currentPos.row !== nextPos.row;
            const curvature = isRowTransition ? 100 : 0;
            
            const circleRadius = window.innerWidth < 640 ? 20 : 24;
            let startXOffset = circleRadius;
            let endXOffset = -circleRadius;
            let startYOffset = 0;
            let endYOffset = 0;
            
            if (isRowTransition) {
              startYOffset = circleRadius;
              endYOffset = -circleRadius;
              
              if (currentPos.col === nextPos.col) {
                startXOffset = 0;
                endXOffset = 0;
              } else if (currentPos.col > nextPos.col) {
                startXOffset = -circleRadius;
                endXOffset = circleRadius;
              } else {
                startXOffset = circleRadius;
                endXOffset = -circleRadius;
              }
            } else {
              if (currentPos.isReverseRow) {
                startXOffset = -circleRadius;
                endXOffset = circleRadius;
              } else {
                startXOffset = circleRadius;
                endXOffset = -circleRadius;
              }
            }

            if (participant.isSigned && !nextParticipant.isSigned && !nextParticipant.rejectionReason) {
              let reverse = false;
              
              if (!isRowTransition && currentPos.isReverseRow) {
                reverse = true;
              }
              
              return (
                <AnimatedBeam
                  key={`beam-${index}`}
                  duration={1.5}
                  containerRef={containerRef}
                  fromRef={{ current: participantRefs.current[index] }}
                  toRef={{ current: participantRefs.current[index + 1] }}
                  pathColor="gray"
                  gradientStartColor="#3b82f6"
                  gradientStopColor="#8b5cf6"
                  startXOffset={startXOffset}
                  endXOffset={endXOffset}
                  startYOffset={startYOffset}
                  endYOffset={endYOffset}
                  curvature={curvature}
                  reverse={reverse}
                />
              );
            }

            if (participant.isSigned && (nextParticipant.isSigned || nextParticipant.rejectionReason)) {
              return (
                <StaticLine
                  key={`line-${index}`}
                  containerRef={containerRef}
                  fromRef={{ current: participantRefs.current[index] }}
                  toRef={{ current: participantRefs.current[index + 1] }}
                  color="#22c55e"
                  strokeWidth={2}
                  startXOffset={startXOffset}
                  endXOffset={endXOffset}
                  startYOffset={startYOffset}
                  endYOffset={endYOffset}
                  curvature={curvature}
                />
              );
            }

            return null;
          })}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default DocumentApprovalFlow;
