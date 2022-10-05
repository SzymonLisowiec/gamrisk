import { Injectable } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import * as EventEmitter from 'events';
import { UserNotFoundException } from 'src/user/exceptions/user-not-found.exception';
import { UserService } from 'src/user/user.service';
import { Context, Telegraf } from 'telegraf';
import { Message, Update } from 'telegraf/typings/core/types/typegram';
import Config from './config';
import { TELEGRAM_COMMANDS_METADATA, TELEGRAM_UPDATE_LISTENERS_METADATA } from './telegram.constants';

@Injectable()
export class TelegramService {
  private events = new EventEmitter();
  private bot: Telegraf;

  constructor(
    private readonly reflector: Reflector,
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly userService: UserService,
  ) {
    this.bot = new Telegraf(Config.botToken);
    
    this.bot.use(async (context: Context<any>, next: any) => {
      const from = (context.update.message || context.update.callback_query).from;
      try {
        const user = await this.userService.getUserByTelegramId(from.id.toString());
        context.state.userId = user.id;
        next();
      } catch (error) {
        switch (error.constructor) {
          case UserNotFoundException:
            const user = await this.userService.createUserByTelegram(
              from.id.toString(),
              from.username,
              from.language_code,
            );
            context.state.userId = user.id;
            next();
            break;
            
          default:
            console.error(error);
        }
      }
    });

    this.bot.on('message', (context: Context<Update.MessageUpdate>, ...args: unknown[]) => {
      const message = <Message.TextMessage>context?.update?.message;
      if (message?.text?.startsWith('/')) {
        const command = message.text.match(/^\/([\w_-]+).*?/)?.[1] || null;
        if (!command) return;
        this.events.emit('command', context, ...args);
        this.events.emit(`command#${command}`, context, ...args);
      } else {
        this.events.emit('message', context, ...args);
      }
    });
    this.bot.on('inline_query', (...args: unknown[]) => { this.events.emit('inline_query', ...args) });
    this.bot.on('callback_query', (context: any, ...args: unknown[]) => {
      const name = context.update.callback_query.data.split(':')[0];
      this.events.emit(`callback_query#${name}`, context, ...args);
    });
    // this.bot.catch((error) => {
    //   console.dir(error);
    // });

    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }
  
  onApplicationBootstrap() {
    this.loadEventListeners();
    this.bot.launch();
  }

  onApplicationShutdown() {
    this.events.removeAllListeners();
  }

  loadEventListeners() {
    const commands = [];
    
    const providers = this.discoveryService.getProviders();
    const controllers = this.discoveryService.getControllers();
    [...providers, ...controllers]
      .filter((wrapper) => wrapper.instance && !wrapper.isAlias)
      .forEach((wrapper: InstanceWrapper) => {
        const { instance } = wrapper;
        const prototype = Object.getPrototypeOf(instance) || {};
        this.metadataScanner.scanFromPrototype(
          instance,
          prototype,
          (methodKey: string) => {
            const listeners = this.reflector.get(
              TELEGRAM_UPDATE_LISTENERS_METADATA,
              instance[methodKey],
            );
            if (!listeners) return;
            listeners.forEach((listener) => {
              switch (listener.method) {
                case 'on':
                  this.events.on.apply(this.events, [
                    ...listener.args,
                    (...args: unknown[]) =>
                      instance[methodKey].call(instance, ...args),
                  ]);
                  break;
                  
                case 'command':
                  this.events.on.apply(this.events, [
                    listener.args[0] ? `command#${listener.args[0]}` : 'command',
                    (...args: unknown[]) =>
                      instance[methodKey].call(instance, ...args),
                  ]);
                  break;
                  
                default:
                  this.bot[listener.method].apply(this.bot, [
                    ...listener.args,
                    (...args: unknown[]) =>
                      instance[methodKey].call(instance, ...args),
                  ]);
              }
            });
            
            const foundCommands = this.reflector.get(
              TELEGRAM_COMMANDS_METADATA,
              instance[methodKey],
            );
            if (!foundCommands) return;
            commands.push(...foundCommands);
          },
        );
      });
    this.bot.telegram.setMyCommands(commands);
  }
}
