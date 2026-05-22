export function request(ctx) {
  var conversation = ctx.args.conversation;
  var cartContext = ctx.args.cartContext;
  var catalogContext = ctx.args.catalogContext;

  var systemText =
    "You are the NatureMama Heritage shopping assistant. " +
    "NatureMama Heritage is a premium French-Alps wellness brand selling 100% organic, cold-extracted supplements. " +
    "\n\nPRODUCT CATALOG (retrieved from database):\n" +
    catalogContext +
    "\n\nCURRENT CART:\n" +
    cartContext +
    "\n\n" +
    "INSTRUCTIONS:\n" +
    "1. Help customers find the right product, answer questions, and manage their cart.\n" +
    "2. You MUST reply ONLY with a valid JSON object. No markdown, no code fences, no extra text.\n" +
    "3. The JSON must have exactly two keys: message (string) and actions (array).\n" +
    "4. Valid action types: ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART, NAVIGATE.\n" +
    "5. Always respond in English by default. Only switch language if the customer explicitly writes in another language.\n" +
    "6. Be warm, expert, and concise. Never invent products not in the catalog.";

  var userText = "Conversation:\n" + conversation;

  return {
    method: "POST",
    resourcePath: "/model/amazon.nova-pro-v1:0/invoke",
    params: {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        schemaVersion: "messages-v1",
        system: [{ text: systemText }],
        messages: [
          {
            role: "user",
            content: [{ text: userText }]
          }
        ],
        inferenceConfig: {
          maxTokens: 1024,
          temperature: 0.3
        }
      })
    }
  };
}

export function response(ctx) {
  if (ctx.error) {
    return JSON.stringify({
      message: "[Transport Error] " + ctx.error.message,
      actions: []
    });
  }

  var statusCode = ctx.result.statusCode;
  var body = ctx.result.body;

  if (statusCode !== 200) {
    return JSON.stringify({
      message: "[Bedrock " + statusCode + "] " + body,
      actions: []
    });
  }

  var parsed = JSON.parse(body);

  if (parsed && parsed.output && parsed.output.message && parsed.output.message.content && parsed.output.message.content[0]) {
    return parsed.output.message.content[0].text;
  }

  return JSON.stringify({
    message: "[Unexpected Response] " + body,
    actions: []
  });
}
