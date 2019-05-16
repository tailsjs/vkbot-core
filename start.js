// Модули
try{
const { VK } = require('vk-io');
}catch(e){
console.error(`У вас отсутствует модуль 'VK-IO'`)
}
const vk = new VK();
try{
const fs = require('fs');
}catch(e){
console.error(`У вас отсутствует модуль 'fs'`)	
}
try{
const colors = require('colors');
}catch(e){
console.error(`У вас отсутствует модуль 'colors'`)	
}
const config = require("./config.js");
// database
try{
const low = require('lowdb');
}catch(e){
console.error(`У вас отсутствует мудль 'lowdb'`)	
}
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('database/db.json');
const db = low(adapter);

db.defaults({ users: [] }).write();

db.getUser = async(ID, msg) => {
  let user = db.get('users').find({ id: ID }).value();
  if (!user) {
    db.get('users').push({
      id: ID,
      userID: db.get('users').value().length + 1,
      nick: (await vk.api.users.get({ user_ids: ID }))[0].first_name,
      rights: 0,
      warns: 0,
      ban: {
        isBanned: false,
        reason: ''
      }
    }).write();
    user = db.get('users').find({ id: ID }).value();
  }
  return user;
};

// Объявляем объект с командами
const cmds = fs
  .readdirSync(`${__dirname}/cmds/`)
  .filter((name) => /\.js$/i.test(name))
  .map((name) => require(`${__dirname}/cmds/${name}`));

// Определяем профиль/группу, токен
if (config.group_id > 0 || config.group_id != 0) {
  vk.setOptions({
    'token': config.token,
    'pollingGroupId': config.group_id,
    'group_id': config.group_id
  });
}
else {
  vk.setToken(config.token);
}
if(config.owner == 0)return console.error(`Вы не указали ID создателя!`.red_bold)
// Определяем имя бота
let botN = '';
if (!config.botNameString || config.botNameString == '') {
  return console.log('Укажите имя бота в файле config.js'.red.bold);
}
else {
  botN = config.botNameString;
}

// Консолим успешный запуск
console.log(`Бот на ядре Fakeman Cat (PLUS VERSION) успешно запущен. Введите команду боту в ВК: ${botN}, тест`.green.bold);

// Запускаем Полинг (Polling)
vk.updates.startPolling();

// Запускаем обработчик новых и изменённых сообщений
vk.updates.on(['new_message', 'edit_message'], async(msg) => {
  // Если сообщение от группы или исходящее, то возвращаем
  if (msg.senderId < 1 || msg.isOutbox) {
    return;
  }
  // Если в сообщении нет обращения к боту и если это чат, то возвращаем
  if (!config.botName.test(msg.text) && msg.isChat) {
    return;
  }

  // Консолим сообщения
  console.log(msg.subTypes[0] + ` ${msg.senderId} => ${msg.text}`.green.bold);

  // Делаем так, чтобы бот писал...
  msg.setActivity();

  // Загружаем весь payload. Нужно от возникновения ошибок
  if (config.group_id == 0) {
    await msg.loadMessagePayload();
  }
  
  // Объявление важных переменных:
  msg.text = msg.text.replace(config.botName, ''); // Текст сообщения равен тексту без имени бота: Кот, привет => привет
  msg.user = await db.getUser(msg.senderId); // Переменная содержащая в себе информацию о пользователе из базы
  msg.fwds = msg.forwards || []; // Просто упрощение..
  msg.rights = ["Пользователь", "Вип", "Админ", "Создатель"] // Тоже упрощение
  msg.atch = msg.attachments || []; // Упрощаем аттачманты
  // PayLoad клавиатуры
  if (msg.messagePayload) {
  msg.text = msg.messagePayload.command
  } 
  // Определяем команду по regexp или tag.
  let cmd = cmds.find(cmd => cmd.regexp ? cmd.regexp.test(msg.text) : (new RegExp(`^\\s*(${cmd.tag.join('|')})`, "i")).test(msg.text));
  if (!cmd && config.settings.sendEmptyCommand) return msg.send('&#128213; | Команда не найдена!'); // Если нет команды и в настройках включена отправка сообщения о том, что нет команды, то отправляем сообщение с тем, что нет команды
  if (!cmd && config.settings.sendEmptyCommand == false)return; // Если нет команды и в настройках выключена отправка сообщения о том, что нет команды, то ничего не отправляем.
  // Функции "отправлялки" сообщений
  if(config.settings.showRightIcons){
  msg.answer = (text = "", params = {}) => {
    const result = msg.isChat ? `${config.rightIcons[msg.user.rights]} ${msg.user.nick},\n${text}` : `${text}`;
    return msg.send(result, params);
  }
  }
  if(!config.settings.showRightIcons){
	 msg.answer = (text = "", params = {}) => {
    const result = `${text}`;
    return msg.send(result, params);
  } 
  }
  msg.ok = (text = "", params = {}) => {
    return msg.answer('&#128215; | ' + text, params);
  };
  msg.error = (text = "", params = {}) => {
    return msg.answer('&#128213; | ' + text, params);
  };
  msg.warn = (text = "", params = {}) => {
    return msg.answer('&#128210; | ' + text, params);
  };

  // Проверки пользователя
  if (msg.user.rights < cmd.rights) {
    return msg.error(`Команда доступна только ${[,'Випам', 'Админам', 'Создателю'][cmd.rights]} ${cmd.rights > 0 && cmd.rights !== 3 ? 'или выше' : ''}`);
  }
  if (msg.user.ban.isBanned) {
    return msg.send(`&#128213; | Вы забокированы по причине: "${msg.user.ban.reason}"`);
  }

  // Выполнение функции через try { ... } catch() { ... }
  try {
    await cmd.func(msg, { botN, cmds, vk, VK, cmd, db, config });
  }
  catch (e) {
    console.log(`Ошибка:\n${e}`.red.bold);
	if(!config.settings.showErrorsUser){
	if(msg.user.rights < 3){
	msg.error(`Произошла ошибка, о которой уже сообщено создателю.`)
    msg.error(`Ошибка при выполнении команды '${msg.text}'\nКод ошибки: ${e}`, {
		user_id: config.owner
	});
	}
		if(msg.user.rights == 3){
	  msg.error(`Ошибка: ${e}`)
  }
	}
	if(config.settings.showErrorsUser){
		msg.error(`Ошибка: ${e}`)
	}
	}
  
});

// Консолим ошибки
process.on("uncaughtException", e => {
  console.log(e);
});

process.on("unhandledRejection", e => {
  console.log(e);
});
