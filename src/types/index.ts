export type BotStatus = 'online' | 'offline' | 'error' | 'starting';

export interface Bot {
  id: string;
  name: string;
  token: string;
  prefix: string;
  status: BotStatus;
  avatarUrl?: string;
  serverId?: string;
  createdAt: number;
}

export type LogLevel = 'info' | 'warn' | 'error' | 'success';

export interface LogEntry {
  id: string;
  botId: string;
  timestamp: number;
  level: LogLevel;
  action: string;
  message: string;
}

export type RootTabParamList = {
  Dashboard: undefined;
  Bots: undefined;
  Logs: undefined;
  Settings: undefined;
};

export type BotStackParamList = {
  BotList: undefined;
  BotDetail: { botId: string };
  BotAdd: undefined;
  BotEdit: { botId: string };
};
