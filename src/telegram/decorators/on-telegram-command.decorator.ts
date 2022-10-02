import { BotCommandScope } from 'telegraf/typings/core/types/typegram';
import { UpdateType } from 'telegraf/typings/telegram-types';
import { OnTelegramEventOptions } from '../interfaces/on-telegram-event-options';
import { TELEGRAM_COMMANDS_METADATA } from '../telegram.constants';
import { OnTelegramEvent } from './on-telegram-event.decorator';

export const OnTelegramCommand = (
  command: string,
  description: string,
  scope?: BotCommandScope,
  languageCode?: string,
): MethodDecorator => {
  return (
    target: object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const commands = Reflect.getMetadata(
      TELEGRAM_COMMANDS_METADATA,
      descriptor.value,
    ) || [];
    commands.push({
      command,
      description,
      scope,
      languageCode,
    });
    Reflect.defineMetadata(
      TELEGRAM_COMMANDS_METADATA,
      commands,
      descriptor.value,
    );
    return OnTelegramEvent({
      method: 'command',
      args: [command],
    })(target, key, descriptor);
  };
};
