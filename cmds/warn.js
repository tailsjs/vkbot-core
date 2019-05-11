module.exports = {
    tag: ['варн', 'warn', 'заварнить', 'заварнь'],
    func: async(msg, { db }) => {
        let ID = msg.fwds[0] ? msg.fwds[0].senderId : msg.text.split(' ')[1];
        if (!ID || ID < 0 || isNaN(ID)) return msg.error('Укажите правильный айди'); // Если айди не указан или айди меньше нуля (группа) или айди не равен числу, то пишем, что нужно указать айди.
        let user = await db.getUser(ID);
        if (user.ban.isBanned) return msg.error('Этот пользователь забанен.');
        user.warns += 1
        db.write();
        if(user.warns === 3){
			user.ban.isBanned = true
			user.ban.reason = "Нарушение правил."
			db.write()
			msg.ok(`У пользователя 3 варна!\nОн был заблокирован.`)
			msg.warn(`Вас заварнил ${msg.rights[msg.user.rights]} ${msg.user.nick}\nУ вас 3 варна!\nВы заблокированы!`)
		}
        msg.ok(`Пользователь [id${user.id}|${user.nick}] успешно заварнен!`);
        msg.warn(`Вас заварнил ${msg.rights[msg.user.rights]} ${msg.user.nick}`, {
			user_id: ID
		})
    },
    rights: 2, // Команда для Админов и выше
    help: 'варн [айди]',
    desc: 'заварнить пользователя'
};
