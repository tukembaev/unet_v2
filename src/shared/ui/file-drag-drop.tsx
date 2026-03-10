import React, { useState, useRef, useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { cn } from 'shared/lib';
import { Button } from './button';
import { Card } from './card';

export interface FileDragDropProps {
  /** Текущие выбранные файлы */
  files: File[];
  /** Callback при добавлении файлов */
  onFilesChange: (files: File[]) => void;
  /** Максимальное количество файлов */
  maxFiles?: number;
  /** Максимальный размер файла в байтах */
  maxFileSize?: number;
  /** Разрешенные типы файлов */
  accept?: string;
  /** Дополнительные CSS классы */
  className?: string;
  /** Текст заголовка */
  title?: string;
  /** Текст описания */
  description?: string;
  /** Показывать список выбранных файлов */
  showFileList?: boolean;
  /** Множественный выбор файлов */
  multiple?: boolean;
  /** Неактивное состояние */
  disabled?: boolean;
}

export function FileDragDrop({
  files,
  onFilesChange,
  maxFiles = 10,
  maxFileSize = 10 * 1024 * 1024, // 10MB по умолчанию
  accept,
  className,
  title = 'Перетащите файлы сюда',
  description = 'Поддерживаются любые типы файлов',
  showFileList = true,
  multiple = true,
  disabled = false,
}: FileDragDropProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = useCallback((newFiles: File[]): File[] => {
    const validFiles: File[] = [];
    
    for (const file of newFiles) {
      // Проверка размера файла
      if (file.size > maxFileSize) {
        console.warn(`Файл ${file.name} превышает максимальный размер`);
        continue;
      }
      
      // Проверка типа файла (если указан accept)
      if (accept) {
        const acceptTypes = accept.split(',').map(type => type.trim());
        const fileType = file.type;
        const fileName = file.name;
        const isValidType = acceptTypes.some(type => {
          if (type.startsWith('.')) {
            // Проверка по расширению
            return fileName.toLowerCase().endsWith(type.toLowerCase());
          } else if (type.includes('/*')) {
            // Проверка по основной категории MIME
            return fileType.startsWith(type.split('/*')[0]);
          } else {
            // Точная проверка MIME типа
            return fileType === type;
          }
        });
        
        if (!isValidType) {
          console.warn(`Файл ${file.name} имеет неподдерживаемый тип`);
          continue;
        }
      }
      
      validFiles.push(file);
    }
    
    return validFiles;
  }, [maxFileSize, accept]);

  const addFiles = useCallback((newFiles: File[]) => {
    if (disabled) return;
    
    const validFiles = validateFiles(newFiles);
    
    if (!multiple) {
      // Для одиночного выбора заменяем все файлы
      onFilesChange(validFiles.slice(0, 1));
      return;
    }
    
    // Для множественного выбора добавляем к существующим
    const currentFilesCount = files.length;
    const availableSlots = maxFiles - currentFilesCount;
    
    if (availableSlots <= 0) {
      console.warn('Достигнуто максимальное количество файлов');
      return;
    }
    
    const filesToAdd = validFiles.slice(0, availableSlots);
    const updatedFiles = [...files, ...filesToAdd];
    onFilesChange(updatedFiles);
  }, [disabled, validateFiles, multiple, files, maxFiles, onFilesChange]);

  const removeFile = useCallback((index: number) => {
    if (disabled) return;
    
    const updatedFiles = files.filter((_, i) => i !== index);
    onFilesChange(updatedFiles);
  }, [disabled, files, onFilesChange]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragActive(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (disabled) return;
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, [disabled, addFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    addFiles(selectedFiles);
    
    // Очищаем значение input для возможности выбора того же файла
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [addFiles]);

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Card
        className={cn(
          'border-2 border-dashed transition-all duration-200 cursor-pointer',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50',
          disabled && 'opacity-50 cursor-not-allowed',
          'p-6 text-center'
        )}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
      
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
      </Card>

      {showFileList && files.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            Выбрано файлов: {files.length}
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((file, index) => (
              <Card
                key={`${file.name}-${file.size}-${index}`}
                className="flex items-center justify-between p-3 border border-border bg-card"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 flex-shrink-0">
                    <Upload className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-medium truncate">
                      {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                </div>
                {!disabled && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="text-muted-foreground hover:text-destructive flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
