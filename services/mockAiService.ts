const AI_RESPONSES = [
  "That's an interesting perspective. Tell me more.",
  'I can certainly help with that. Here is what I found...',
  'Based on my analysis, the best approach would be to consider the underlying factors.',
  'Could you clarify what you mean by that?',
  'Here is a creative solution to your problem...',
  "I've processed your request. The results indicate a positive trend.",
];

export function getMockAiResponse(): Promise<string> {
  const delay = 1000 + Math.random() * 1000;
  return new Promise((resolve) =>
    setTimeout(
      () => resolve(AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)]),
      delay
    )
  );
}
