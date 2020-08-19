const config = require('../info.json')

module.exports = {
  name: "ban",
  name2: "banir",
  type: "Moderação",
  description: `Bane o(s) usuário(s) mencionado(s) do servidor!\nModo de usar:\nMencionando o(s) usuário(s) *${config.prefix}ban @user1 @user2 \`motivo do banimento\`\  \`5\`*\nPelo username ou apelido:\n*${config.prefix}ban username1 \\ apelido1 \`motivo do banimento\`  \`3\`*\n\nOBS: *Nem o motivo do banimento nem a quantidade de dias para deletar mensagens são obrigatórios, mas se for utilizá-los, coloque-os entre "\`" (crases) e após os usuários a serem banidos, na sequência (motivo, dias)!*\n*Para colocar a quantidade de dias para deletar mensagens você deve colocar um motivo (obrigatoriamente)!*`,

  async execute(message, args, comando, client) {
    const mencoes = message.mentions
    const usernamesDigitados = message.content.trim().slice(config.prefix.length + comando.length).split("\\").map(username => username.trim().toLowerCase())
    const banOptions = message.content.trim().slice((message.content.trim().split('').indexOf('`')+1 === 0) ? message.content.length : message.content.trim().split('').indexOf('`')+1).split('`')
    const motivo = banOptions.shift()
    banOptions.shift()
    const daysMsgDelete = banOptions.shift()
    const botMembro = message.guild.member(client.user.id)
    const permissoesBot = message.channel.memberPermissions(botMembro)
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES")
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    const podeManageMessages = permissoesBot.has("MANAGE_MESSAGES")
    if (mencoes.members.size === 0) {
      if(usernamesDigitados[0] === '') {
        if (podeEnviarMsg) {
          message.reply(`Quem eu devo banir do servidor?`);
        } else if (podeAddReactions) {
          message.react('❌')
        }
        return;
      } else {
        for(let i = 0; i < usernamesDigitados.length; i++) {
          const usernameMembers = await message.guild.members.cache.filter(member => member.user.username.toLowerCase() === usernamesDigitados[i])
          const nicknameMembers = await message.guild.members.cache.filter(member => (member.nickname === null) ? member.nickname : member.nickname.toLowerCase() === usernamesDigitados[i])
          if(usernameMembers.size !== 0) {
            if (!message.member.hasPermission("BAN_MEMBERS")) {
              if (podeEnviarMsg) {
                message.reply(`você não pode banir membros nesse servidor!`);
              } else if (podeAddReactions) {
                message.react('❌')
              }
              return;
            }
            if (!botMembro.hasPermission("BAN_MEMBERS")) {
              if (podeEnviarMsg) {
                message.reply(`eu não tenho permissão para banir membros!`);
              } else if (podeAddReactions) {
                message.react('❌')
              }
              return;
            }
            if (usernameMembers.has(message.guild.ownerID)) {
              if (podeEnviarMsg) {
                message.reply(`ele é o dono do servidor, não posso fazer isso!`)
              } else if (podeAddReactions) {
                message.react('❌')
              }
              return;
            }
            if (usernameMembers.map(user => user.roles.highest.position >= botMembro.roles.highest.position).indexOf(true) !== -1) {
              if (podeEnviarMsg) {
                message.reply(`eu não posso banir esse membro, ele tem um cargo maior que o meu!`)
              } else if (podeAddReactions) {
                message.react('❌')
              }
              return;
            }
            if (usernameMembers.map(user => user.roles.highest.position >= message.member.roles.highest.position).indexOf(true) !== -1 && message.author.id !== message.guild.ownerID) {
              if (podeEnviarMsg) {
                message.reply(`eu não posso banir esse membro, ele tem um cargo maior que o seu!`)
              } else if (podeAddReactions) {
                message.react('❌')
              }
              return;
            }
            if (usernameMembers.has(botMembro)) {
              if (podeEnviarMsg) {
                message.reply(`eu não posso me banir do servidor, faça isso manualmente ou peça ajuda a outro bot!`);
              } else if (podeAddReactions) {
                message.react('❌')
              }
              return;
            }
            if (usernameMembers.has(message.member)) {
              if (podeEnviarMsg) {
                message.reply(`Você não pode se banir do servidor, isso é apenas questão de segurança!`);
              } else if (podeAddReactions) {
                message.react('❌')
              }
              return;
            }
            usernameMembers.map(member => member.ban({reason: motivo, days: (Number(daysMsgDelete) >= 0 && Number(daysMsgDelete) <= 7) ? Number(daysMsgDelete) : 7}))
            if (podeManageMessages) {
              message.delete();
            } else if(podeEnviarMsg) {  
              message.reply(`**${usernameMembers.map(member => member.user.username)[0]}** foi banido com sucesso!`)
            } else if(podeAddReactions) {
              message.react('✅')
            }
          } else if(nicknameMembers.size !== 0) {
            if (!message.member.hasPermission("BAN_MEMBERS")) {
              if (podeEnviarMsg) {
                message.reply(`você não pode banir membros nesse servidor!`);
              } else if (podeAddReactions) {
                message.react('❌')
              }
              return;
            }
            if (!botMembro.hasPermission("BAN_MEMBERS")) {
              if (podeEnviarMsg) {
                message.reply(`eu não tenho permissão para banir membros!`);
              } else if (podeAddReactions) {
                message.react('❌')
              }
              return;
            }
            if (nicknameMembers.has(message.guild.ownerID)) {
              if (podeEnviarMsg) {
                message.reply(`ele é o dono do servidor, não posso fazer isso!`)
              } else if (podeAddReactions) {
                message.react('❌')
              }
              return;
            }
            if (nicknameMembers.map(user => user.roles.highest.position >= botMembro.roles.highest.position).indexOf(true) !== -1) {
              if (podeEnviarMsg) {
                message.reply(`eu não posso banir esse membro, ele tem um cargo maior que o meu!`)
              } else if (podeAddReactions) {
                message.react('❌')
              }
              return;
            }
            if (nicknameMembers.map(user => user.roles.highest.position >= message.member.roles.highest.position).indexOf(true) !== -1 && message.author.id !== message.guild.ownerID) {
              if (podeEnviarMsg) {
                message.reply(`eu não posso banir esse membro, ele tem um cargo maior que o seu!`)
              } else if (podeAddReactions) {
                message.react('❌')
              }
              return;
            }
            if (nicknameMembers.has(botMembro)) {
              if (podeEnviarMsg) {
                message.reply(`eu não posso me banir do servidor, faça isso manualmente ou peça ajuda a outro bot!`);
              } else if (podeAddReactions) {
                message.react('❌')
              }
              return;
            }
            if (nicknameMembers.has(message.member)) {
              if (podeEnviarMsg) {
                message.reply(`Você não pode se banir do servidor, isso é apenas questão de segurança!`);
              } else if (podeAddReactions) {
                message.react('❌')
              }
              return;
            }
            nicknameMembers.map(member => member.ban({reason: motivo, days: (Number(daysMsgDelete) >= 0 && Number(daysMsgDelete) <= 7) ? Number(daysMsgDelete) : 7}))
            if (podeManageMessages) {
              message.delete();
            } else if(podeEnviarMsg) {
              message.reply(`**${nicknameMembers.map(member => member.nickname)[0]}** foi banido com sucesso!`)
            } else if(podeAddReactions) {
              message.react('✅')
            }
          } else {
            if(podeEnviarMsg) {
              message.reply(`eu não conheço esse membro!`)
            } else if(podeAddReactions) {
              message.react('❌')
            }
          }
          
        }
        return;
      }
    }
    if (!message.member.hasPermission("BAN_MEMBERS")) {
      if (podeEnviarMsg) {
        message.reply(`você não pode banir membros nesse servidor!`);
      } else if (podeAddReactions) {
        message.react('❌')
      }
      return;
    }
    if (!botMembro.hasPermission("BAN_MEMBERS")) {
      if (podeEnviarMsg) {
        message.reply(`eu não tenho permissão para banir membros!`);
      } else if (podeAddReactions) {
        message.react('❌')
      }
      return;
    }
    if (mencoes.members.has(message.guild.ownerID)) {
      if (podeEnviarMsg) {
        message.reply(`ele é o dono do servidor, não posso fazer isso!`)
      } else if (podeAddReactions) {
        message.react('❌')
      }
      return;
    }
    if (mencoes.members.map(user => user.roles.highest.position >= botMembro.roles.highest.position).indexOf(true) !== -1) {
      if (podeEnviarMsg) {
        message.reply(`eu não posso banir esse membro, ele tem um cargo maior que o meu!`)
      } else if (podeAddReactions) {
        message.react('❌')
      }
      return;
    }
    if (mencoes.members.map(user => user.roles.highest.position >= message.member.roles.highest.position).indexOf(true) !== -1 && message.author.id !== message.guild.ownerID) {
      if (podeEnviarMsg) {
        message.reply(`eu não posso banir esse membro, ele tem um cargo maior que o seu!`)
      } else if (podeAddReactions) {
        message.react('❌')
      }
      return;
    }
    if (mencoes.has(client.user)) {
      if (podeEnviarMsg) {
        message.reply(`eu não posso me banir do servidor, faça isso manualmente ou peça ajuda a outro bot!`);
      } else if (podeAddReactions) {
        message.react('❌')
      }
      return;
    }
    if (mencoes.has(message.author)) {
      if (podeEnviarMsg) {
        message.reply(`Você não pode se banir do servidor, isso é apenas questão de segurança!`);
      } else if (podeAddReactions) {
        message.react('❌')
      }
      return;
    }
    mencoes.members.map(user => user.ban({reason: motivo, days: (Number(daysMsgDelete) >= 0 && Number(daysMsgDelete) <= 7) ? Number(daysMsgDelete) : 7}))
    if (podeManageMessages) {
      message.delete();
    } else if(podeEnviarMsg) {
      if(mencoes.members.size > 1) {
        message.reply(`**${mencoes.members.map(member => member.user.username).join(', ')}** foram banidos com sucesso!`)
      } else {
        message.reply(`**${mencoes.members.map(member => member.user.username)[0]}** foi expulso com sucesso!`)
      }
    } else if(podeAddReactions) {
      message.react('✅')
    }
  }
}