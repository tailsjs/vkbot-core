const token = ""; //токен группы или профиля на котором будет стоять бот
const group_id = 0; //если бот будет стоять в группе, то 0 меняем на айди группы без -. Если бот будет стоять на профиле, то оставляем 0
const owner = 0; //Айди владельца бота. Нужно, например для отправки сообщения об ошибке владельцу
const rightIcons = ['[&#10084;]', '[&#128155;]', '[&#128420;]', '[&#128736;]']; //Иконки прав в виде кода, указываются в отправлялке сообщений
// Можно сменить на свои: const rightIcons = ['Пользователь', 'Вип', 'Админ', 'Создатель'];
const settings = { // Настройки бота
  sendEmptyCommand: true, // Отправлять сообщение о том, что нет команды? По умолчанию, да.
  showErrorsUser: false, // Отправлять сообщение пользователю, если произойдёт ошибка? По умолчанию, нет.
  showRightIcons: true // Показывать иконки прав? По умолчанию, да.
}

let botNameString = "";
// Тут имена бота. Сразу и для регекса.
// Если хотите что бы у бота было одно имя, то укажите после "let botNameString = " обычную строку с именем: 'Имя'
// Например: let botNameString = "Кот";
// Для тега нескольких имён писать так: let botNameString = [ "Имя1", "Имя2", "Имя3" ];
// Если вы решили использовать несколько имён, то в команде "Помощь" будет отображено только первое имя.

const botName = new RegExp(`^(${Array.isArray(botNameString) ? botNameString.join('|'): botNameString})[,\\s]*`, 'i');
botNameString = Array.isArray(botNameString) ? botNameString[0] : botNameString;

module.exports = {
  token,
  group_id,
  owner,
  botName,
  botNameString,
  rightIcons,
  settings
};
