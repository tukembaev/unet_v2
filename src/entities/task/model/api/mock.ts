import { Task, TasksRoot, User } from "../types";

const mockUser: User = {
    id: 1,
    user: 1,
    first_name: "Ариф",
    surname: "Тукембаев",
    surname_name: "Тукембаев Ариф",
    short_name: "Тукембаев А.",
    number_phone: "0700000000",
    imeag: "https://www.hindustantimes.com/ht-img/img/2023/07/15/550x309/jennie_1689410686831_1689410687014.jpg",
    email: "arif@example.com",
    division: "Отдел разработки",
    position: "Frontend разработчик",
    is_online: true,
  };
  
  const taskBase: Task = {
    id: 1,
    task_name: "Пример задачи",
    creator: mockUser,
    status: "Ждет выполнения с 12.10.2025 12:00",
    attached_document: "",
    create_date: "12.10.2025 12:00",
    deadline_date: "15.10.2025 18:00",
    members: [
      { id: 10, member: mockUser, member_type: "Ответственный" },
      { id: 11, member: mockUser, member_type: "Наблюдатель" },
    ],
  };
  
  export const mockTasks: TasksRoot = {
    ALL: {
      OVERDUE: [
        { ...taskBase, id: 1, task_name: "Все — просрочено 1" },
        { ...taskBase, id: 2, task_name: "Все — просрочено 2" },
      ],
      TODAY: [
        { ...taskBase, id: 3, task_name: "Все — сегодня 1" },
        { ...taskBase, id: 4, task_name: "Все — сегодня 2" },
      ],
      WEEK: [
        { ...taskBase, id: 5, task_name: "Все — неделя 1" },
        { ...taskBase, id: 6, task_name: "Все — неделя 2" },
      ],
      MONTH: [
        { ...taskBase, id: 7, task_name: "Все — месяц 1" },
        { ...taskBase, id: 8, task_name: "Все — месяц 2" },
      ],
      LONGRANGE: [
        { ...taskBase, id: 9, task_name: "Все — долгосрочная 1" },
        { ...taskBase, id: 10, task_name: "Все — долгосрочная 2" },
      ],
      INDEFINITE: [
        { ...taskBase, id: 11, task_name: "Все — без срока 1" },
        { ...taskBase, id: 12, task_name: "Все — без срока 2" },
      ],
    },
    ATTACHED: {
      OVERDUE: [
        { ...taskBase, id: 13, task_name: "Прикрепленные — просрочено 1" },
        { ...taskBase, id: 14, task_name: "Прикрепленные — просрочено 2" },
      ],
      TODAY: [
        { ...taskBase, id: 15, task_name: "Прикрепленные — сегодня 1" },
        { ...taskBase, id: 16, task_name: "Прикрепленные — сегодня 2" },
      ],
      WEEK: [
        { ...taskBase, id: 17, task_name: "Прикрепленные — неделя 1" },
        { ...taskBase, id: 18, task_name: "Прикрепленные — неделя 2" },
      ],
      MONTH: [
        { ...taskBase, id: 19, task_name: "Прикрепленные — месяц 1" },
        { ...taskBase, id: 20, task_name: "Прикрепленные — месяц 2" },
      ],
      LONGRANGE: [
        { ...taskBase, id: 21, task_name: "Прикрепленные — долгосрочная 1" },
        { ...taskBase, id: 22, task_name: "Прикрепленные — долгосрочная 2" },
      ],
      INDEFINITE: [
        { ...taskBase, id: 23, task_name: "Прикрепленные — без срока 1" },
        { ...taskBase, id: 24, task_name: "Прикрепленные — без срока 2" },
      ],
    },
    COMPLETED: {
      OVERDUE: [
        { ...taskBase, id: 25, task_name: "Завершенные — просрочено 1" },
        { ...taskBase, id: 26, task_name: "Завершенные — просрочено 2" },
      ],
      TODAY: [
        { ...taskBase, id: 27, task_name: "Завершенные — сегодня 1" },
        { ...taskBase, id: 28, task_name: "Завершенные — сегодня 2" },
      ],
      WEEK: [
        { ...taskBase, id: 29, task_name: "Завершенные — неделя 1" },
        { ...taskBase, id: 30, task_name: "Завершенные — неделя 2" },
      ],
      MONTH: [
        { ...taskBase, id: 31, task_name: "Завершенные — месяц 1" },
        { ...taskBase, id: 32, task_name: "Завершенные — месяц 2" },
      ],
      LONGRANGE: [
        { ...taskBase, id: 33, task_name: "Завершенные — долгосрочная 1" },
        { ...taskBase, id: 34, task_name: "Завершенные — долгосрочная 2" },
      ],
      INDEFINITE: [
        { ...taskBase, id: 35, task_name: "Завершенные — без срока 1" },
        { ...taskBase, id: 36, task_name: "Завершенные — без срока 2" },
      ],
    },
    DOING: {
      OVERDUE: [
        { ...taskBase, id: 37, task_name: "Выполняю — просрочено 1" },
        { ...taskBase, id: 38, task_name: "Выполняю — просрочено 2" },
      ],
      TODAY: [
        { ...taskBase, id: 39, task_name: "Выполняю — сегодня 1" },
        { ...taskBase, id: 40, task_name: "Выполняю — сегодня 2" },
      ],
      WEEK: [
        { ...taskBase, id: 41, task_name: "Выполняю — неделя 1" },
        { ...taskBase, id: 42, task_name: "Выполняю — неделя 2" },
      ],
      MONTH: [
        { ...taskBase, id: 43, task_name: "Выполняю — месяц 1" },
        { ...taskBase, id: 44, task_name: "Выполняю — месяц 2" },
      ],
      LONGRANGE: [
        { ...taskBase, id: 45, task_name: "Выполняю — долгосрочная 1" },
        { ...taskBase, id: 46, task_name: "Выполняю — долгосрочная 2" },
      ],
      INDEFINITE: [
        { ...taskBase, id: 47, task_name: "Выполняю — без срока 1" },
        { ...taskBase, id: 48, task_name: "Выполняю — без срока 2" },
      ],
    },
    HELPING: {
      OVERDUE: [
        { ...taskBase, id: 49, task_name: "Помогаю — просрочено 1" },
        { ...taskBase, id: 50, task_name: "Помогаю — просрочено 2" },
      ],
      TODAY: [
        { ...taskBase, id: 51, task_name: "Помогаю — сегодня 1" },
        { ...taskBase, id: 52, task_name: "Помогаю — сегодня 2" },
      ],
      WEEK: [
        { ...taskBase, id: 53, task_name: "Помогаю — неделя 1" },
        { ...taskBase, id: 54, task_name: "Помогаю — неделя 2" },
      ],
      MONTH: [
        { ...taskBase, id: 55, task_name: "Помогаю — месяц 1" },
        { ...taskBase, id: 56, task_name: "Помогаю — месяц 2" },
      ],
      LONGRANGE: [
        { ...taskBase, id: 57, task_name: "Помогаю — долгосрочная 1" },
        { ...taskBase, id: 58, task_name: "Помогаю — долгосрочная 2" },
      ],
      INDEFINITE: [
        { ...taskBase, id: 59, task_name: "Помогаю — без срока 1" },
        { ...taskBase, id: 60, task_name: "Помогаю — без срока 2" },
      ],
    },
    INSTRUCTED: {
      OVERDUE: [
        { ...taskBase, id: 61, task_name: "Поручил — просрочено 1" },
        { ...taskBase, id: 62, task_name: "Поручил — просрочено 2" },
      ],
      TODAY: [
        { ...taskBase, id: 63, task_name: "Поручил — сегодня 1" },
        { ...taskBase, id: 64, task_name: "Поручил — сегодня 2" },
      ],
      WEEK: [
        { ...taskBase, id: 65, task_name: "Поручил — неделя 1" },
        { ...taskBase, id: 66, task_name: "Поручил — неделя 2" },
      ],
      MONTH: [
        { ...taskBase, id: 67, task_name: "Поручил — месяц 1" },
        { ...taskBase, id: 68, task_name: "Поручил — месяц 2" },
      ],
      LONGRANGE: [
        { ...taskBase, id: 69, task_name: "Поручил — долгосрочная 1" },
        { ...taskBase, id: 70, task_name: "Поручил — долгосрочная 2" },
      ],
      INDEFINITE: [
        { ...taskBase, id: 71, task_name: "Поручил — без срока 1" },
        { ...taskBase, id: 72, task_name: "Поручил — без срока 2" },
      ],
    },
    WATCHING: {
      OVERDUE: [
        { ...taskBase, id: 73, task_name: "Наблюдаю — просрочено 1" },
        { ...taskBase, id: 74, task_name: "Наблюдаю — просрочено 2" },
      ],
      TODAY: [
        { ...taskBase, id: 75, task_name: "Наблюдаю — сегодня 1" },
        { ...taskBase, id: 76, task_name: "Наблюдаю — сегодня 2" },
      ],
      WEEK: [
        { ...taskBase, id: 77, task_name: "Наблюдаю — неделя 1" },
        { ...taskBase, id: 78, task_name: "Наблюдаю — неделя 2" },
      ],
      MONTH: [
        { ...taskBase, id: 79, task_name: "Наблюдаю — месяц 1" },
        { ...taskBase, id: 80, task_name: "Наблюдаю — месяц 2" },
      ],
      LONGRANGE: [
        { ...taskBase, id: 81, task_name: "Наблюдаю — долгосрочная 1" },
        { ...taskBase, id: 82, task_name: "Наблюдаю — долгосрочная 2" },
      ],
      INDEFINITE: [
        { ...taskBase, id: 83, task_name: "Наблюдаю — без срока 1" },
        { ...taskBase, id: 84, task_name: "Наблюдаю — без срока 2" },
      ],
    },
  };