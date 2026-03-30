import { useState } from 'react';
import { FileDragDrop } from './file-drag-drop';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

// Пример базового использования
export function BasicExample() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Базовый пример</CardTitle>
        <CardDescription>
          Простое использование с множественным выбором файлов
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FileDragDrop
          files={files}
          onFilesChange={setFiles}
        />
      </CardContent>
    </Card>
  );
}

// Пример с ограничениями
export function RestrictedExample() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>С ограничениями</CardTitle>
        <CardDescription>
          Максимум 3 файла, только изображения, до 5MB каждый
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FileDragDrop
          files={files}
          onFilesChange={setFiles}
          maxFiles={3}
          maxFileSize={5 * 1024 * 1024} // 5MB
          accept="image/*"
          title="Только изображения"
          description="JPG, PNG, GIF до 5MB"
        />
      </CardContent>
    </Card>
  );
}

// Пример с одиночным выбором
export function SingleFileExample() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Одиночный файл</CardTitle>
        <CardDescription>
          Выбор только одного файла
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FileDragDrop
          files={files}
          onFilesChange={setFiles}
          multiple={false}
          title="Выберите один файл"
          description="Только один файл можно загрузить"
        />
      </CardContent>
    </Card>
  );
}

// Пример с неактивным состоянием
export function DisabledExample() {
  const [files, setFiles] = useState<File[]>([
    new File([''], 'example.pdf', { type: 'application/pdf' })
  ]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Неактивное состояние</CardTitle>
        <CardDescription>
          Компонент в неактивном состоянии
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FileDragDrop
          files={files}
          onFilesChange={setFiles}
          disabled={true}
          title="Загрузка отключена"
          description="Файлы нельзя добавить или удалить"
        />
      </CardContent>
    </Card>
  );
}

// Пример с кастомизацией
export function CustomExample() {
  const [files, setFiles] = useState<File[]>([]);

  const handleClear = () => {
    setFiles([]);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Кастомизация</CardTitle>
        <CardDescription>
          С дополнительными элементами управления
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FileDragDrop
          files={files}
          onFilesChange={setFiles}
          maxFiles={5}
          title="Перетащите документы"
          description="PDF, DOC, DOCX до 10MB"
          accept=".pdf,.doc,.docx"
        />
        {files.length > 0 && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleClear}
              className="flex-1"
            >
              Очистить все
            </Button>
            <Button 
              onClick={() => console.log('Files:', files)}
              className="flex-1"
            >
              Показать файлы
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Комплексный пример со всеми опциями
export function FullExample() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Полный функционал</CardTitle>
        <CardDescription>
          Все доступные опции компонента
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FileDragDrop
          files={files}
          onFilesChange={setFiles}
          maxFiles={10}
          maxFileSize={50 * 1024 * 1024} // 50MB
          accept="image/*,.pdf,.doc,.docx,.txt"
          title="Загрузка документов"
          description="Изображения и документы до 50MB"
          showFileList={true}
          multiple={true}
          disabled={false}
          className="border-2"
        />
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Текущие файлы: {files.length}</p>
          <p>Общий размер: {files.reduce((acc, file) => acc + file.size, 0).toLocaleString()} байт</p>
        </div>
      </CardContent>
    </Card>
  );
}
