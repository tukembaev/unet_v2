import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "shared/ui";
import { Skeleton } from "shared/ui";

export const WorkloadTableSkeleton = () => {
  // Количество строк для skeleton (примерно 5-7 строк)
  const skeletonRows = 6;
  
  // Количество преподавателей для skeleton (примерно 3-4)
  const teacherCount = 4;

  return (
    <div className="overflow-x-auto">
      <Table className="border-collapse border border-gray-300 text-xs">
        <TableHeader className="hover:bg-transparent">
          {/* Первый уровень заголовков */}
          <TableRow className="hover:bg-transparent h-8">
            <TableHead rowSpan={3} className="text-center align-middle border border-gray-300 px-1 py-1">
              <Skeleton className="h-4 w-32" />
            </TableHead>
            <TableHead rowSpan={3} className="text-center align-middle border border-gray-300 px-1 py-1">
              <Skeleton className="h-4 w-16" />
            </TableHead>
            <TableHead rowSpan={3} className="text-center align-middle border border-gray-300 px-1 py-1">
              <Skeleton className="h-4 w-16" />
            </TableHead>
            <TableHead rowSpan={3} className="text-center align-middle border border-gray-300 px-1 py-1 min-w-32">
              <Skeleton className="h-4 w-20" />
            </TableHead>
            <TableHead rowSpan={3} className="text-center align-middle border border-gray-300 px-1 py-1">
              <Skeleton className="h-4 w-16" />
            </TableHead>
            <TableHead rowSpan={3} className="text-center align-middle border border-gray-300 px-1 py-1">
              <Skeleton className="h-4 w-16" />
            </TableHead>
            <TableHead rowSpan={3} className="text-center align-middle border border-gray-300 px-1 py-1">
              <Skeleton className="h-4 w-16" />
            </TableHead>
            <TableHead rowSpan={3} className="text-center align-middle border border-gray-300 px-1 py-1">
              <Skeleton className="h-4 w-12" />
            </TableHead>
            <TableHead colSpan={16} className="text-center border border-gray-300 px-1 py-1">
              <Skeleton className="h-4 w-40 mx-auto" />
            </TableHead>
            <TableHead colSpan={teacherCount * 2} className="text-center border border-gray-300 px-1 py-1">
              <Skeleton className="h-4 w-32 mx-auto" />
            </TableHead>
          </TableRow>

          {/* Второй уровень заголовков */}
          <TableRow className="hover:bg-transparent h-8">
            <TableHead colSpan={3} className="text-center border border-gray-300 px-1 py-1">
              <Skeleton className="h-4 w-20 mx-auto" />
            </TableHead>
            <TableHead rowSpan={2} className="text-center align-middle border border-gray-300 px-1 py-1">
              <Skeleton className="h-4 w-16" />
            </TableHead>
            <TableHead rowSpan={2} className="text-center align-middle border border-gray-300 px-1 py-1">
              <Skeleton className="h-4 w-16" />
            </TableHead>
            <TableHead rowSpan={2} className="text-center align-middle border border-gray-300 px-1 py-1">
              <Skeleton className="h-4 w-12" />
            </TableHead>
            <TableHead rowSpan={2} className="text-center align-middle border border-gray-300 px-1 py-1">
              <Skeleton className="h-4 w-12" />
            </TableHead>
            <TableHead colSpan={7} className="text-center border border-gray-300 px-1 py-1">
              <Skeleton className="h-4 w-16 mx-auto" />
            </TableHead>
            <TableHead rowSpan={2} className="text-center align-middle border border-gray-300 px-1 py-1">
              <Skeleton className="h-4 w-16" />
            </TableHead>
            <TableHead rowSpan={2} className="text-center align-middle border border-gray-300 px-1 py-1">
              <Skeleton className="h-4 w-12" />
            </TableHead>
            {/* Teacher columns */}
            {Array.from({ length: teacherCount }).map((_, index) => (
              <TableHead key={index} colSpan={2} className="text-center border border-gray-300 px-1 py-1">
                <Skeleton className="h-4 w-16" />
              </TableHead>
            ))}
          </TableRow>

          {/* Третий уровень заголовков */}
          <TableRow className="hover:bg-transparent h-8">
            <TableHead className="text-center border border-gray-300 px-1 py-1">
              <Skeleton className="h-4 w-12" />
            </TableHead>
            <TableHead className="text-center border border-gray-300 px-1 py-1">
              <Skeleton className="h-4 w-12" />
            </TableHead>
            <TableHead className="text-center border border-gray-300 px-1 py-1">
              <Skeleton className="h-4 w-16" />
            </TableHead>
            <TableHead className="text-center border border-gray-300 px-1 py-1">
              <Skeleton className="h-4 w-16" />
            </TableHead>
            <TableHead className="text-center border border-gray-300 px-1 py-1">
              <Skeleton className="h-4 w-16" />
            </TableHead>
            <TableHead className="text-center border border-gray-300 px-1 py-1">
              <Skeleton className="h-4 w-16" />
            </TableHead>
            <TableHead className="text-center border border-gray-300 px-1 py-1">
              <Skeleton className="h-4 w-12" />
            </TableHead>
            <TableHead className="text-center border border-gray-300 px-1 py-1">
              <Skeleton className="h-4 w-8" />
            </TableHead>
            <TableHead className="text-center border border-gray-300 px-1 py-1">
              <Skeleton className="h-4 w-16" />
            </TableHead>
            <TableHead className="text-center border border-gray-300 px-1 py-1">
              <Skeleton className="h-4 w-16" />
            </TableHead>
            {/* Teacher sub-columns */}
            {Array.from({ length: teacherCount }).map((_, index) => (
              <React.Fragment key={index}>
                <TableHead className="text-center border border-gray-300 px-1 py-1">
                  <Skeleton className="h-4 w-8" />
                </TableHead>
                <TableHead className="text-center border border-gray-300 px-1 py-1">
                  <Skeleton className="h-4 w-12" />
                </TableHead>
              </React.Fragment>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: skeletonRows }).map((_, rowIndex) => (
            <TableRow key={rowIndex} className="h-6">
              {/* Основные колонки */}
              <TableCell className="border border-gray-300 px-1 py-1">
                <Skeleton className="h-3 w-24" />
              </TableCell>
              <TableCell className="text-center border border-gray-300 px-1 py-1">
                <Skeleton className="h-3 w-8 mx-auto" />
              </TableCell>
              <TableCell className="text-center border border-gray-300 px-1 py-1">
                <Skeleton className="h-3 w-12 mx-auto" />
              </TableCell>
              <TableCell className="text-center border border-gray-300 px-1 py-1 w-32">
                <Skeleton className="h-3 w-16 mx-auto" />
              </TableCell>
              <TableCell className="text-center border border-gray-300 px-1 py-1">
                <Skeleton className="h-3 w-8 mx-auto" />
              </TableCell>
              <TableCell className="text-center border border-gray-300 px-1 py-1">
                <Skeleton className="h-3 w-8 mx-auto" />
              </TableCell>
              <TableCell className="text-center border border-gray-300 px-1 py-1">
                <Skeleton className="h-3 w-8 mx-auto" />
              </TableCell>
              <TableCell className="text-center border border-gray-300 px-1 py-1">
                <Skeleton className="h-3 w-6 mx-auto" />
              </TableCell>
              
              {/* Аудиторные занятия */}
              <TableCell className="text-center border border-gray-300 px-1 py-1">
                <Skeleton className="h-3 w-6 mx-auto" />
              </TableCell>
              <TableCell className="text-center border border-gray-300 px-1 py-1">
                <Skeleton className="h-3 w-6 mx-auto" />
              </TableCell>
              <TableCell className="text-center border border-gray-300 px-1 py-1">
                <Skeleton className="h-3 w-6 mx-auto" />
              </TableCell>
              
              {/* Консультации и контроль */}
              <TableCell className="text-center border border-gray-300 px-1 py-1">
                <Skeleton className="h-3 w-6 mx-auto" />
              </TableCell>
              <TableCell className="text-center border border-gray-300 px-1 py-1">
                <Skeleton className="h-3 w-6 mx-auto" />
              </TableCell>
              <TableCell className="text-center border border-gray-300 px-1 py-1">
                <Skeleton className="h-3 w-6 mx-auto" />
              </TableCell>
              <TableCell className="text-center border border-gray-300 px-1 py-1">
                <Skeleton className="h-3 w-6 mx-auto" />
              </TableCell>
              
              {/* Руководство */}
              <TableCell className="text-center border border-gray-300 px-1 py-1">
                <Skeleton className="h-3 w-6 mx-auto" />
              </TableCell>
              <TableCell className="text-center border border-gray-300 px-1 py-1">
                <Skeleton className="h-3 w-6 mx-auto" />
              </TableCell>
              <TableCell className="text-center border border-gray-300 px-1 py-1">
                <Skeleton className="h-3 w-6 mx-auto" />
              </TableCell>
              <TableCell className="text-center border border-gray-300 px-1 py-1">
                <Skeleton className="h-3 w-6 mx-auto" />
              </TableCell>
              <TableCell className="text-center border border-gray-300 px-1 py-1">
                <Skeleton className="h-3 w-6 mx-auto" />
              </TableCell>
              <TableCell className="text-center border border-gray-300 px-1 py-1">
                <Skeleton className="h-3 w-6 mx-auto" />
              </TableCell>
              <TableCell className="text-center border border-gray-300 px-1 py-1">
                <Skeleton className="h-3 w-6 mx-auto" />
              </TableCell>
              
              {/* Посещение занятий ППС */}
              <TableCell className="text-center border border-gray-300 px-1 py-1">
                <Skeleton className="h-3 w-6 mx-auto" />
              </TableCell>
              <TableCell className="text-center font-semibold border border-gray-300">
                <Skeleton className="h-3 w-8 mx-auto" />
              </TableCell>
              
              {/* Teacher columns */}
              {Array.from({ length: teacherCount }).map((_, teacherIndex) => (
                <React.Fragment key={teacherIndex}>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">
                    <Skeleton className="h-3 w-6 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">
                    <Skeleton className="h-3 w-6 mx-auto" />
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
