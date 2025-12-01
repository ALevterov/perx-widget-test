import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return <ConfigProvider locale={ruRU}>{children}</ConfigProvider>;
};

