import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export const WelcomeSection = () => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Доброе утро');
    else if (hour < 18) setGreeting('Добрый день');
    else setGreeting('Добрый вечер');
  }, []);

  const userStr = localStorage.getItem('user');
  const userName = userStr ? JSON.parse(userStr).username : 'Пользователь';

  const today = new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="relative overflow-hidden  border-b">
      {/* Decorative Elements */}

      <div className="relative px-2 py-2">
        <div className="space-y-1 pb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span className="capitalize">{today}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {greeting}, <span className="text-primary">{userName}</span>
          </h1>
        </div>
      </div>
    </div>
  );
};
