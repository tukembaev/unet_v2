import { useRef, useMemo, useState, useEffect } from "react";
import { AnimatedBeam, Circle, StaticLine } from "shared/components/animated-ui/AnimatedBeam";
import { Avatar, AvatarFallback, AvatarImage } from "shared/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "shared/ui/tooltip";
import { Card, CardContent } from "shared/ui";
import { cn } from "shared/lib";
import { CheckCircle2, XCircle, Clock, GitBranch } from "lucide-react";

export type ApprovalRole = "Отправитель" | "Согласующий" | "Получатель";

export interface ApprovalParticipant {
  id: string;
  name: string;
  photo?: string;
  role: ApprovalRole;
  isSigned: boolean;
  rejectionReason?: string;
  isCurrent?: boolean;
  division?: string; // Место работы
  position?: string; // Должность
}

interface DocumentApprovalFlowProps {
  participants: ApprovalParticipant[];
}

const DocumentApprovalFlow = ({ participants }: DocumentApprovalFlowProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRefsReady, setIsRefsReady] = useState(false);
  const [usersPerRow, setUsersPerRow] = useState(4);
  
  // Create refs dynamically for each participant
  const participantRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Адаптивное количество пользователей в ряду
  useEffect(() => {
    const updateUsersPerRow = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setUsersPerRow(2); // Мобильные: 2 пользователя в ряду
      } else if (width < 1024) {
        setUsersPerRow(3); // Планшеты: 3 пользователя в ряду
      } else {
        setUsersPerRow(4); // Десктоп: 4 пользователя в ряду
      }
    };
    
    updateUsersPerRow();
    window.addEventListener('resize', updateUsersPerRow);
    return () => window.removeEventListener('resize', updateUsersPerRow);
  }, []);
  
  // Функция для получения позиции в змейке
  const getSnakePosition = (index: number) => {
    const row = Math.floor(index / usersPerRow);
    const col = index % usersPerRow;
    
    // Для нечетных рядов разворачиваем направление
    const isReverseRow = row % 2 === 1;
    const actualCol = isReverseRow ? (usersPerRow - 1 - col) : col;
    
    return { row, col: actualCol, isReverseRow };
  };
  
  // Ensure we have the right number of refs
  useMemo(() => {
    participantRefs.current = participantRefs.current.slice(0, participants.length);
  }, [participants.length, usersPerRow]);

  // Check if all refs are ready
  useEffect(() => {
    const checkRefs = () => {
      const allRefsReady = participantRefs.current.every(ref => ref !== null);
      if (allRefsReady && participantRefs.current.length === participants.length) {
        setIsRefsReady(true);
      }
    };

    // Small delay to ensure refs are set
    const timer = setTimeout(checkRefs, 50);
    return () => clearTimeout(timer);
  }, [participants.length]);

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get status color for Circle border
  const getStatusColor = (participant: ApprovalParticipant, index: number) => {
    if (participant.isSigned) {
      return "border-green-500";
    }
    if (participant.rejectionReason) {
      return "border-red-500";
    }
    // Желтый для следующего в очереди (все до него подписали, он не отказал)
    const allPreviousSigned = index === 0 || participants.slice(0, index).every(p => p.isSigned);
    if (!participant.isSigned && !participant.rejectionReason && allPreviousSigned) {
      return "border-yellow-500";
    }
    return "border-gray-300";
  };

  // Find first rejected participant index
  const firstRejectedIndex = participants.findIndex((p) => p.rejectionReason);

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-4 md:p-6">
        <div className="mb-4 flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Цепочка согласования</h3>
        </div>
        
        <TooltipProvider delayDuration={0}>
          <div
            className="relative w-full "
            ref={containerRef}
          >
            {/* Grid layout для змейки */}
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Circle
                      ref={(el) => {
                        participantRefs.current[index] = el;
                      }}
                      className={cn(
                        "transition-all cursor-pointer hover:scale-110 w-10 h-10 sm:w-12 sm:h-12",
                        getStatusColor(participant, index)
                      )}
                    >
                      <Avatar className="size-full">
                        <AvatarImage src={participant.photo} alt={participant.name} />
                        <AvatarFallback className="text-xs">{getInitials(participant.name)}</AvatarFallback>
                      </Avatar>
                    </Circle>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[280px]">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={participant.photo} alt={participant.name} />
                        <AvatarFallback className="text-xs">{getInitials(participant.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{participant.name}</p>
                        <p className="text-xs text-muted-foreground">{participant.role}</p>
                      </div>
                    </div>
                    
                    {/* Division and Position */}
                    {(participant.division || participant.position) && (
                      <div className="space-y-1 text-xs">
                        {participant.position && (
                          <div className="flex items-start gap-2">
                            <span className="text-muted-foreground min-w-[70px]">Должность:</span>
                            <span className="font-medium flex-1">{participant.position}</span>
                          </div>
                        )}
                        {participant.division && (
                          <div className="flex items-start gap-2">
                            <span className="text-muted-foreground min-w-[70px]">Отдел:</span>
                            <span className="font-medium flex-1">{participant.division}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 pt-2 border-t">
                      {participant.isSigned ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">Подписано</span>
                        </>
                      ) : participant.rejectionReason ? (
                        <>
                          <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs text-red-600 dark:text-red-400 font-medium">Отклонено</p>
                            <p className="text-xs text-muted-foreground mt-1">{participant.rejectionReason}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                            {(() => {
                              const allPreviousSigned = index === 0 || participants.slice(0, index).every(p => p.isSigned);
                              return allPreviousSigned ? "На подписании" : "Ожидает";
                            })()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>

                    {/* Name below circle */}
                    <span className="text-[10px] sm:text-xs font-medium text-center max-w-[60px] sm:max-w-[80px] md:max-w-[120px] truncate">
                      {participant.role}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Линии соединения в формате змейки */}
            {isRefsReady && participants.map((participant, index) => {
              if (index >= participants.length - 1) return null;

              if (firstRejectedIndex !== -1 && index > firstRejectedIndex) {
                return null;
              }

              const nextParticipant = participants[index + 1];
              const currentPos = getSnakePosition(index);
              const nextPos = getSnakePosition(index + 1);
              
              // Определяем, переход на новую строку или в пределах строки
              const isRowTransition = currentPos.row !== nextPos.row;
              
              // Curvature для змейки - изгиб на переходах между рядами
              const curvature = isRowTransition ? 100 : 0;
              
              // Offsets для линий (адаптивные для размера круга)
              const circleRadius = window.innerWidth < 640 ? 20 : 24; // 40px/2 для мобильных, 48px/2 для десктопа
              let startXOffset = circleRadius;
              let endXOffset = -circleRadius;
              let startYOffset = 0;
              let endYOffset = 0;
              
              // Для перехода между рядами
              if (isRowTransition) {
                startYOffset = circleRadius; // снизу круга
                endYOffset = -circleRadius; // сверху следующего круга
                
                // Если в той же колонке (вертикальный переход)
                if (currentPos.col === nextPos.col) {
                  startXOffset = 0; // строго по центру
                  endXOffset = 0; // строго по центру
                }
                // Если переходим вниз справа налево (col уменьшается)
                else if (currentPos.col > nextPos.col) {
                  startXOffset = -circleRadius; // слева от круга
                  endXOffset = circleRadius; // справа от следующего
                } 
                // Если переходим вниз слева направо (col увеличивается)
                else {
                  startXOffset = circleRadius; // справа от круга  
                  endXOffset = -circleRadius; // слева от следующего
                }
              } else {
                // Горизонтальные линии в пределах ряда
                // Если это reverse ряд (нечетный), то визуально идем справа налево
                if (currentPos.isReverseRow) {
                  startXOffset = -circleRadius; // от левого края текущего
                  endXOffset = circleRadius; // к правому краю следующего
                } else {
                  startXOffset = circleRadius; // от правого края текущего
                  endXOffset = -circleRadius; // к левому краю следующего
                }
              }

              // AnimatedBeam: from signed to waiting
              if (participant.isSigned && !nextParticipant.isSigned && !nextParticipant.rejectionReason) {
                // Определяем направление анимации
                let reverse = false;
                
                // Для нижнего ряда (reverse): анимация справа налево
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

              // Green line: current participant signed and next also signed OR next rejected
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
      </CardContent>
    </Card>
  );
};

export default DocumentApprovalFlow;