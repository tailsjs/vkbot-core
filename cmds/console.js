module.exports = {
  regexp: /^(к[оа]н[сз]о[лсз]ь|кмд)/i,
  func: async(msg) => {
    	const cmd = msg.text.split(" ").slice(1).join(" ");
	if(!cmd)return msg.error(`Нет команды!`);
	try{
		let console = require('child_process').execSync(cmd);
		msg.ok(`Выполнено!\nОтвет: ${console}`)
	}catch(e){
		msg.error(`Неудача!\n ${e.message}`)
	}
  },
  rights: 3,
  help: 'консоль [команда]',
  desc: 'выполнить команду'
};
