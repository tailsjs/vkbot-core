# Создание базы данных
Её создать довольно просто, не смотря на трудности
#
Допустим, вы хотите создать базу данных с.. Городами пользователей (может быть, вы сможете написать команду, где надо делать свои города и т.д)
# Что же надо?
Для начала, зайдём в start.js
Теперь, вам нужно найти следующую строку:
```js
db.defaults({ users: [] }).write();
```
#
После неё вставляем следующую строку:
```js
db.defaults({ cityes: [] }).write(); // Вы можете сменить cityes на что-то другое
```
Отлично, теперь давайте перейдём дальше
#
Находим следующую строку:
```js
db.getUser = async(ID) => {
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
```
После неё, как в прошлом шагу вставляем:
```js
db.getCity = async(ID) => {
  let city = db.get('cityes').find({ id: ID }).value();
  if (!city) {
    db.get('cityes').push({
	id: ID
      // Переменные, о них потом.
    }).write();
    city = db.get('cityes').find({ id: ID }).value();
  }
  return city;
};
```
#
Разберём
```js
db.getCity = async(ID) => {
```
Пытаемся получить пользователя с таким ID
#
```js
let city = db.get('cityes').find({ id: ID }).value();
```
Создаём переменную с городом пользователя
#
```js
if (!city) {
```
Нет города?
#
```js
db.get('cityes').push({
```
Вставляем информацию о пользователе.
#
```js
id: ID
      // Переменные, о них потом.
```
Вот и дошли до этого момента
Переменные.
Вы можете вставить абсолютно любую переменную, но чтобы она была примерно так:
```js
id: ID,
name: "", // Не конечную переменную пишем с запятой в конце 
live: 0 // Конечную переменную пишем без запятой
```
* НИ В КОЕМ СЛУЧАЕ НЕ УБИРАЙТЕ ПЕРЕМЕННУЮ id!
Если вы её убирёте, то будет плохо!
#
```js
}).write();
```
Вписываем в базу
#
```js
city = db.get('cityes').find({ id: ID }).value();
```
Ставим переменную city на пользователя с таким ID
*
```js
 return city;
```
Возращаем переменную в функцию.
#
Потом же, находим следующую строку:
```js
 msg.user = await db.getUser(msg.senderId);
```
*
Дальше, вводим следующее:
```js
msg.city = await db.getCity(msg.senderId);
```
И... По сути всё! Вы создали целую базу данных!
#
Если нужна помощь по созданию базы, пишите в [личку](https://vk.com/tailsjs), помогу чем смогу
```js
Кстати, к базе можно обращатся через msg.city
```
