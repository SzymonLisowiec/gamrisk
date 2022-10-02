export interface OnTelegramEventOptions {
  method: 'on' | 'command' | 'start' | 'stop' | 'action' | 'textMention',
  args: unknown[],
}
