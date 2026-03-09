export interface SlackServer {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
  botInstalled: boolean;
}
