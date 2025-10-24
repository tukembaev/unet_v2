import {
  CreateTaskDialogUser,
  CreateTaskDialogStudent,
  CreateTaskDialogObserver,
  CreateTaskDialogCoExecutor,
  CreateTaskFormData,
} from '../types';

// Mock functions for fetching data - replace with actual API calls
export const fetchUsers = async (query?: string): Promise<CreateTaskDialogUser[]> => {
  // Mock data - replace with actual API call
  const mockUsers: CreateTaskDialogUser[] = [
    { id: '1', name: 'Иван Петров', email: 'ivan@example.com' },
    { id: '2', name: 'Мария Сидорова', email: 'maria@example.com' },
    { id: '3', name: 'Алексей Козлов', email: 'alexey@example.com' },
  ];
  
  if (query) {
    return mockUsers.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase())
    );
  }
  return mockUsers;
};

export const fetchStudents = async (query?: string): Promise<CreateTaskDialogStudent[]> => {
  // Mock data - replace with actual API call
  const mockStudents: CreateTaskDialogStudent[] = [
    { id: '1', name: 'Анна Иванова', group: 'ИС-21' },
    { id: '2', name: 'Дмитрий Смирнов', group: 'ИС-21' },
    { id: '3', name: 'Елена Козлова', group: 'ИС-22' },
  ];
  
  if (query) {
    return mockStudents.filter(student => 
      student.name.toLowerCase().includes(query.toLowerCase()) ||
      student.group.toLowerCase().includes(query.toLowerCase())
    );
  }
  return mockStudents;
};

export const fetchObservers = async (query?: string): Promise<CreateTaskDialogObserver[]> => {
  // Mock data - replace with actual API call
  const mockObservers: CreateTaskDialogObserver[] = [
    { id: '1', name: 'Сергей Волков', role: 'Начальник отдела' },
    { id: '2', name: 'Ольга Морозова', role: 'Заместитель директора' },
    { id: '3', name: 'Николай Орлов', role: 'Менеджер проекта' },
  ];
  
  if (query) {
    return mockObservers.filter(observer => 
      observer.name.toLowerCase().includes(query.toLowerCase()) ||
      observer.role.toLowerCase().includes(query.toLowerCase())
    );
  }
  return mockObservers;
};

export const fetchCoExecutors = async (query?: string): Promise<CreateTaskDialogCoExecutor[]> => {
  // Mock data - replace with actual API call
  const mockCoExecutors: CreateTaskDialogCoExecutor[] = [
    { id: '1', name: 'Андрей Лебедев', department: 'IT отдел' },
    { id: '2', name: 'Татьяна Соколова', department: 'Бухгалтерия' },
    { id: '3', name: 'Михаил Новиков', department: 'HR отдел' },
  ];
  
  if (query) {
    return mockCoExecutors.filter(coExecutor => 
      coExecutor.name.toLowerCase().includes(query.toLowerCase()) ||
      coExecutor.department.toLowerCase().includes(query.toLowerCase())
    );
  }
  return mockCoExecutors;
};

export const createTask = async (formData: CreateTaskFormData): Promise<void> => {
  // TODO: Implement actual task creation API call
  console.log('Creating task:', formData);
  
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Task created successfully');
      resolve();
    }, 1000);
  });
};
