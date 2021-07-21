module.exports = {
    tag: ['unwarn', 'разварн', 'разварнить', 'разварнь'],
    func: async(msg, { db }) => {
        let ID = msg.fwds[0] ? msg.fwds[0].senderId : msg.text.split(' ')[1];
        if (!ID || ID < 0 || isNaN(ID)) return msg.error('Укажите правильный айди'); // Если айди не указан или айди меньше нуля (группа) или айди не равен числу, то пишем, что нужно указать айди.
	if(ID === msg.senderId)return msg.error(`Вы не можете разварнить себя!`)
        let user = await db.getUser(ID);
        if (!user.ban.isBanned) return msg.error('Этот пользователь уже разбанен');
        if(user.warns === 0)return msg.error(`У пользователя нет варнов!`)

        user.warns -= 1
        db.write();

        msg.ok(`Пользователь [id${user.id}|${user.nick}] успешно разварнен`);
        msg.warn(`Вас разварнил ${msg.rights[msg.user.rights]} ${msg.user.nick}`, {
		user_id: ID
	})
    },
    rights: 2, // Команда для Админов и выше
    help: 'разварн [айди]',
    desc: 'разварнить пользователя'
};
