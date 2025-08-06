# Обработка ошибок в Telegram Bot

## Глобальные обработчики ошибок

### 1. События бота (в `src/bot/index.ts`)

```typescript
// Ошибки polling (получение обновлений)
bot.on('polling_error', (error) => {
  log.error(`Polling error: ${error.message}`);
});

// Ошибки webhook
bot.on('webhook_error', (error) => {
  log.error(`Webhook error: ${error.message}`);
});

// Общие ошибки бота
bot.on('error', (error) => {
  log.error(`Bot error: ${error.message}`);
});
```

### 2. Глобальные обработчики процесса (в `src/index.ts`)

```typescript
// Необработанные промисы (unhandled rejections)
process.on('unhandledRejection', (reason, promise) => {
  log.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

// Необработанные исключения
process.on('uncaughtException', (error) => {
  log.error(`Uncaught Exception: ${error.message}`);
  process.exit(1);
});
```

## Специфические ошибки Telegram API

### Коды ошибок и их обработка:

- **403 Forbidden**: 
  - `bot was blocked by the user` - пользователь заблокировал бота
  - `chat not found` - чат не найден

- **400 Bad Request**:
  - `message is too long` - сообщение слишком длинное
  - `chat not found` - чат не найден
  - `message is not modified` - попытка изменить сообщение на то же содержимое

- **429 Too Many Requests**: превышен лимит запросов

## Безопасные методы отправки

Используйте функции из `src/utils/telegramHelper.ts`:

```typescript
import { safeSendMessage, safeSendPhoto, safeEditMessage } from '../utils';

// Безопасная отправка сообщения
const result = await safeSendMessage(bot, chatId, 'Hello!');
if (!result) {
  // Сообщение не было отправлено (пользователь заблокировал бота, ошибка API и т.д.)
}

// Безопасная отправка фото
const photoResult = await safeSendPhoto(bot, chatId, photoBuffer);

// Безопасное редактирование сообщения
const editResult = await safeEditMessage(bot, 'New text', { 
  chat_id: chatId, 
  message_id: messageId 
});
```

## Рекомендации

1. **Не завершайте процесс** при ошибках Telegram API - они временные
2. **Логируйте все ошибки** для мониторинга
3. **Используйте типизированные ошибки** для лучшей обработки
4. **Проверяйте результат** безопасных методов отправки
5. **Добавьте retry-логику** для критически важных сообщений

## Мониторинг ошибок

Все ошибки логируются через систему логирования в `src/utils/logger.ts` и могут быть отправлены во внешний сервис мониторинга.
