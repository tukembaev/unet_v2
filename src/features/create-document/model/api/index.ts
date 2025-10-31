import { apiClient } from 'shared/config/axios';
import { Employee, CreateDocumentFormData } from '../types';

// Fetch employees from API
export const fetchEmployees = async (query?: string): Promise<Employee[]> => {
  try {
    const params = new URLSearchParams({
      user_type: 'E',
    });
    
    if (query) {
      params.append('search', query);
    }

    const response = await apiClient.get<Employee[]>(
      `/employees/all-employees/?${params.toString()}`
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

// Create document/raport
export const createDocument = async (formData: CreateDocumentFormData): Promise<void> => {
  try {
    const data = new FormData();
    
    // Append form fields
    data.append('addressee', formData.addressee);
    data.append('type', formData.type);
    data.append('type_doc', formData.type_doc);
    data.append('text', formData.text);
    data.append('very_urgent', formData.very_urgent.toString());
    
    // Append main file
    data.append('file', formData.file);
    
    // Append additional files
    formData.files.forEach((file) => {
      data.append('files', file);
    });

    await apiClient.post('/conversion/raportsforpost/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

