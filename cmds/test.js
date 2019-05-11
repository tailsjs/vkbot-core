module.exports = {
  regexp: /^тест$/,
  func: function(msg, { botN }) {
    msg.ok(`Бот успешно работает на ядре Fakeman Cat (PLUS VERSION)! Введите ${botN}, помощь для списка команд.`);
  },
  help: 'test',
  desc: 'проверка'
};
