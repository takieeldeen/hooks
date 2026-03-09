export const generateSlackUrl = (workflowId: string, userId: string) => {
  const state = Buffer.from(JSON.stringify({ userId, workflowId })).toString(
    "base64",
  );
  const params = new URLSearchParams({
    client_id: process.env.SLACK_CLIENT_ID!,
    scope: [
      "chat:write",
      "channels:read",
      "channels:history",
      "groups:read",
      "groups:history",
      "im:read",
      "im:history",
      "users:read",
    ].join(","),
    redirect_uri: process.env.SLACK_REDIRECT_URI!,
    state,
  });
  //   console.log(state, userId, "STATTTTTTE");
  //   const params = new URLSearchParams({
  //     client_id: process.env.DISCORD_CLIENT_ID!,
  //     response_type: "code",
  //     redirect_uri: process.env.DISCORD_REDIRECT_URI!,
  //     scope: "identify guilds",
  //     state,
  //   });

  const url = `https://slack.com/oauth/v2/authorize?${params}`;
  return url;
};
