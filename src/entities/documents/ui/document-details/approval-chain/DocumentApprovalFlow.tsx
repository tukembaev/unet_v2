import { useRef, useMemo, useState, useEffect } from "react";
import { AnimatedBeam, Circle, StaticLine } from "shared/components/animated-ui/AnimatedBeam";
import { Avatar, AvatarFallback, AvatarImage } from "shared/ui/avatar";
import { cn } from "shared/lib";

export type ApprovalRole = "Отправитель" | "Согласующий" | "Получатель";

export interface ApprovalParticipant {
  id: string;
  name: string;
  photo?: string;
  role: ApprovalRole;
  isSigned: boolean;
  rejectionReason?: string;
  isCurrent?: boolean;
}

interface DocumentApprovalFlowProps {
  participants: ApprovalParticipant[];
}

const DocumentApprovalFlow = ({ participants }: DocumentApprovalFlowProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRefsReady, setIsRefsReady] = useState(false);
  
  // Create refs dynamically for each participant
  const participantRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Ensure we have the right number of refs
  useMemo(() => {
    participantRefs.current = participantRefs.current.slice(0, participants.length);
  }, [participants.length]);

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
  const getStatusColor = (participant: ApprovalParticipant) => {
    if (participant.isSigned) {
      return "border-green-500";
    }
    if (participant.rejectionReason) {
      return "border-red-500";
    }
    if (participant.isCurrent) {
      return "border-blue-500";
    }
    return "border-gray-300";
  };

  // Find first rejected participant index
  const firstRejectedIndex = participants.findIndex((p) => p.rejectionReason);

  return (
    <div
      className="relative flex w-full items-center justify-center overflow-hidden p-10"
      ref={containerRef}
    >
      <div className="flex size-full items-center justify-between gap-2">
        {participants.map((participant, index) => (
          <div key={participant.id} className="relative flex flex-col items-center gap-2">
            {/* Rejection reason badge above circle with arrow */}
            {participant.rejectionReason && (
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-20">
              
                {/* Arrow pointing down to circle */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-destructive"></div>
              </div>
            )}
            <span className="text-xs text-muted-foreground text-center max-w-[120px]">
              {participant.role}
            </span>


             <Circle
              ref={(el) => {
                participantRefs.current[index] = el;
              }}
              className={cn(
                "transition-all",
                getStatusColor(participant)
              )}
            >
              <Avatar className="size-full">
                <AvatarImage src={participant.photo} alt={participant.name} />
                <AvatarFallback>{getInitials(participant.name)}</AvatarFallback>
              </Avatar>
            </Circle>
  
           

            {/* Name below circle */}
            <span className="text-xs font-medium text-center max-w-[120px]">
              {participant.name}
            </span>
         
          </div>
        ))}
      </div>

      {/* Render static lines and animated beam */}
      {isRefsReady && participants.map((participant, index) => {
        if (index >= participants.length - 1) return null;

        // Don't draw lines AFTER someone who rejected (but draw the line TO them)
        if (firstRejectedIndex !== -1 && index > firstRejectedIndex) {
          return null;
        }

        const nextParticipant = participants[index + 1];

        // AnimatedBeam: from signed to waiting (next hasn't signed and hasn't rejected)
        if (participant.isSigned && !nextParticipant.isSigned && !nextParticipant.rejectionReason) {
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
            />
          );
        }

        return null;
      })}
    </div>
  );
};

export default DocumentApprovalFlow;