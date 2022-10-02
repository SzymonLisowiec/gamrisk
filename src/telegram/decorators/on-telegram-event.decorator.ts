import { UpdateType } from 'telegraf/typings/telegram-types';
import { OnTelegramEventOptions } from '../interfaces/on-telegram-event-options';
import { TELEGRAM_UPDATE_LISTENERS_METADATA } from '../telegram.constants';

export const OnTelegramEvent = (
  optionsOrUpdateType: OnTelegramEventOptions | UpdateType,
): MethodDecorator => {
  let options: OnTelegramEventOptions;
  if (typeof optionsOrUpdateType === 'string') {
    options = {
      method: 'on',
      args: [optionsOrUpdateType],
    };
  } else {
    options = optionsOrUpdateType;
  }
  
  return (
    target: object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const listeners = Reflect.getMetadata(
      TELEGRAM_UPDATE_LISTENERS_METADATA,
      descriptor.value,
    ) || [];
    listeners.push(options);
    Reflect.defineMetadata(
      TELEGRAM_UPDATE_LISTENERS_METADATA,
      listeners,
      descriptor.value,
    );
    return descriptor;
  };
};
