import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'shared/ui';

import { Task } from '../model/types';
import { Calendar, MoreHorizontal } from 'lucide-react';
import { AvatarGroup } from 'shared/components/avatar/avatar-group';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate('/task-details', { state: { taskId: task.id } });
  };
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Без срока';
    
    // Parse date string like "12.10.2025 12:00" and format as "12 окт 25"
    try {
      const [datePart] = dateString.split(' ');
      const [day, month, year] = datePart.split('.');
      const monthNames = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
      const monthName = monthNames[parseInt(month) - 1];
      const shortYear = year.slice(-2);
      return `${day} ${monthName} ${shortYear}`;
    } catch {
      return dateString;
    }
  };

  return (
    <Card 
      className="p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="space-y-3">
        {/* Header with title and menu */}
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-sm text-foreground line-clamp-2 flex-1 pr-2">
            {task.task_name}
          </h3>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded">
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2">
          Compile competitor landing page designs for inspiration. G..
        </p>

        {/* Separator */}
        <div className="border-t border-border"></div>

        {/* Bottom section */}
        <div className="space-y-3">
          {/* Members */}
       
            {/* Creation and Deadline */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <AvatarGroup members={task.members} max={2} />

              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {formatDate(task.create_date)}
                  {task.deadline_date && ` - ${formatDate(task.deadline_date)}`}
                </span>
              </div>
            </div>
        </div>
      </div>
    </Card>
  );
};
