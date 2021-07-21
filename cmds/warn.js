module.exports = {
    tag: ['варн', 'warn', 'заварнить', 'заварнь'],
    func: async(msg, { db }) => {
        let ID = msg.fwds[0] ? msg.fwds[0].senderId : msg.text.split(' ')[1];
	if(ID === msg.senderId)return msg.error('Вы не можете выдать себе предупреждение!');
        if (!ID || ID < 0 || isNaN(ID)) return msg.error('Укажите правильный айди'); // Если айди не указан или айди меньше нуля (группа) или айди не равен числу, то пишем, что нужно указать айди.
        let user = await db.getUser(ID);
        if (user.ban.isBanned) return msg.error('Этот пользователь забанен.');
        user.warns += 1
        db.write();
        if(user.warns === 3){
		user.ban.isBanned = true
		user.ban.reason = "Нарушение правил."
		db.write()
		msg.ok('У пользователя 3 предупреждения!\nОн был заблокирован.')
		msg.warn(`Вы получили предупреждение от ${msg.rights[msg.user.rights]} ${msg.user.nick}\nУ вас 3 предупреждения!\nВы заблокированы!`, {
			user_id: ID
		})
	}else if(user.warns < 3){
        	msg.ok(`Пользователь [id${user.id}|${user.nick}] успешно предупреждён!`);
        	msg.warn(`Вы получили предупреждение от ${msg.rights[msg.user.rights]} ${msg.user.nick}`, {
			user_id: ID
		})
	}
    },
    rights: 2, // Команда для Админов и выше
    help: 'варн [айди]',
    desc: 'выдать пользователю предупреждение'
};
