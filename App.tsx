import React from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { ChatArea } from './components/ChatArea';
import { SettingsModal } from './components/Settings';
import { ChatActionsProvider } from './context/ChatContext';
import { useTheme } from './hooks/useTheme';
import { useUIState } from './hooks/useUIState';
import { useChats } from './hooks/useChats';

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { sidebarOpen, settingsOpen, openSidebar, closeSidebar, openSettings, closeSettings } =
    useUIState();
  const { chats, activeChatId, activeChat, handleNewChat, handleSelectChat, handleTogglePin, handleSendMessage } =
    useChats(closeSidebar);

  return (
    <ChatActionsProvider
      value={{ handleSendMessage, handleNewChat, handleSelectChat, handleTogglePin, openSettings }}
    >
      <div className="flex h-full w-full overflow-hidden bg-white dark:bg-gray-950">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 dark:bg-black/40 z-10 md:hidden backdrop-blur-sm transition-opacity"
            onClick={closeSidebar}
          />
        )}

        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onTogglePin={handleTogglePin}
          onOpenSettings={openSettings}
          isOpen={sidebarOpen}
        />

        <main className="flex-1 flex flex-col min-w-0 h-full relative">
          <TopNav
            theme={theme}
            toggleTheme={toggleTheme}
            toggleSidebar={openSidebar}
            currentChatTitle={activeChat?.title !== 'New Chat' ? activeChat?.title : undefined}
          />
          <ChatArea chat={activeChat} />
        </main>

        <SettingsModal isOpen={settingsOpen} onClose={closeSettings} />
      </div>
    </ChatActionsProvider>
  );
};

export default App;
