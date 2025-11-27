import { Card, CardHeader, CardContent, CardFooter } from "shared/ui/card";
import { Button } from "shared/ui/button";
import { Briefcase, FileText, Bell, UserCog, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const EmployeeDashboardPlaceholder = () => {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full"
      >
        <Card className="p-6 border rounded-2xl shadow-lg backdrop-blur-sm">
          <CardHeader className="flex flex-col items-center text-center space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-20 h-20 bg-blue-100 dark:bg-blue-900/40 rounded-full blur-xl" />
              <Briefcase className="w-10 h-10 text-blue-600 dark:text-blue-400 relative z-10" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Панель сотрудника
            </h2>
            <p className="text-muted-foreground text-sm max-w-md">
              Добро пожаловать в университетскую систему. Здесь вы можете
              управлять своими данными, документами и внутренними процессами.
            </p>
          </CardHeader>

          <CardContent className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex flex-col items-center justify-center gap-2 border rounded-xl py-4 hover:bg-muted/50 transition">
              <FileText className="text-indigo-500" />
              <span className="text-sm font-medium">Мои документы</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 border rounded-xl py-4 hover:bg-muted/50 transition">
              <UserCog className="text-emerald-500" />
              <span className="text-sm font-medium">Профиль</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 border rounded-xl py-4 hover:bg-muted/50 transition">
              <Bell className="text-amber-500" />
              <span className="text-sm font-medium">Уведомления</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 border rounded-xl py-4 hover:bg-muted/50 transition">
              <Sparkles className="text-pink-500" />
              <span className="text-sm font-medium">KPI</span>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center pt-4">
            <Button variant="outline" className="rounded-full">
              Перейти к личным данным
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};
