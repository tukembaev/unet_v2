import {
  WelcomeSection,
  TasksOverview,
  DocumentsOverview,
  ActivityFeed,
  NotificationsPanel,
} from './sections';

export const HomePage = () => {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <WelcomeSection />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Main Content (2 columns) */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TasksOverview />
            <DocumentsOverview />
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <NotificationsPanel />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};
