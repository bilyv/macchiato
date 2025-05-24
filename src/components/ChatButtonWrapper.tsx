import { useLocation } from 'react-router-dom';
import ChatButton from './ChatButton';

const ChatButtonWrapper = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  // Only show the chat button on public pages, not on admin pages
  if (isAdminPage) {
    return null;
  }

  return <ChatButton />;
};

export default ChatButtonWrapper;
