export type SlackChannel = {
  id: string;
  created: number;
  creator: string;

  is_org_shared: boolean;
  is_im: boolean;
  context_team_id: string;
  updated: number;

  name: string;
  name_normalized: string;

  is_channel: boolean;
  is_group: boolean;
  is_mpim: boolean;
  is_private: boolean;
  is_archived: boolean;
  is_general: boolean;

  is_shared: boolean;
  is_ext_shared: boolean;
  unlinked: number;
  is_pending_ext_shared: boolean;

  pending_shared: string[];
  parent_conversation: string | null;

  purpose: SlackChannelMetadata;
  topic: SlackChannelMetadata;

  shared_team_ids: string[];
  pending_connected_team_ids: string[];

  is_member: boolean;
  num_members: number;

  properties: SlackChannelProperties;

  previous_names: string[];
};

export type SlackChannelMetadata = {
  value: string;
  creator: string;
  last_set: number;
};

export type SlackChannelProperties = {
  use_case?: string;
};
