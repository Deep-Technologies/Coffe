const Discord = require('discord.js')
const hex = require('../colors.json')
const config = require('../info.json')

module.exports = {
  name: "unmute",
  name2: "desmutar",
  name3: "dessilenciar",
  name4: "dessilencie",
  type: "Moderação",
  description: `Possibilita o usuário citado de falar no servidor novamente!\nModo de usar:\n**Mencionando o(s) usuário(s)** *${config.prefix}unmute @user1 @user2*\n**Pelo username ou apelido:** *${config.prefix}unmute username1 \\ apelido1*\nOBS: *O motivo para o unmute não é obrigatório, mas caso utilize, coloque-o entre crases ("\`")*`,

  async execute(message, args, comando, client) {
    const mencoes = message.mentions
    const usernamesDigitados = message.content.trim().slice(config.prefix.length + comando.length).split("\\").map(username => username.trim().toLowerCase())
    const botMembro = message.guild.member(client.user.id)
    const permissoesBot = message.channel.memberPermissions(botMembro)
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES")
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    const podeManageMessages = permissoesBot.has("MANAGE_MESSAGES")
    const motivo = message.content.trim().slice((message.content.trim().split('').indexOf('`')+1 === 0) ? message.content.length : message.content.trim().split('').indexOf('`')+1).split('`').shift()
    const mutedRoles = await message.guild.roles.cache.find(role => role.permissions.bitfield === 1024)
    if (!message.member.hasPermission("MANAGE_ROLES") || !message.member.hasPermission("MANAGE_CHANNELS")) {
      if (podeEnviarMsg) { message.reply(`você não pode desmutar membros nesse servidor!`); } else if (podeAddReactions) {
        message.react('slash:745761670340804660')
      }
      return;
    }
    if (!botMembro.hasPermission("MANAGE_ROLES") || !botMembro.hasPermission("MANAGE_CHANNELS")) {
      if (podeEnviarMsg) { message.reply(`eu não tenho permissão para desmutar membros!`); } else if (podeAddReactions) {
        message.react('slash:745761670340804660')
      }
      return;
    }
    function verificacoes(members) {
      let podeIr = false
      if (members.has(message.guild.ownerID)) return podeIr = false;
      if(members.map(member => member.hasPermission("ADMINISTRATOR")).indexOf(true) !== -1) return podeIr = false;
      if (members.map(user => user.roles.highest.position >= botMembro.roles.highest.position).indexOf(true) !== -1) {
        if (podeEnviarMsg) {
          message.reply(`eu não posso desmutar esse membro, ele tem um cargo maior que o meu!`)
        } else if (podeAddReactions) {
          message.react('slash:745761670340804660')
        }
        return podeIr = false;
      }
      if (members.map(user => user.roles.highest.position >= message.member.roles.highest.position).indexOf(true) !== -1 && message.author.id !== message.guild.ownerID) {
        if (podeEnviarMsg) {
          message.reply(`eu não posso mutar esse membro, ele tem um cargo maior que o seu!`)
        } else if (podeAddReactions) {
          message.react('slash:745761670340804660')
        }
        return podeIr = false;
      }
      if (members.has(message.member)) {
        if (podeEnviarMsg) {
          message.reply(`você não pode se desmutar do servidor, isso é apenas questão de segurança!`);
        } else if (podeAddReactions) {
          message.react('alertcircle:745709428937981992')
        }
        return podeIr = false;
      }
      return podeIr = true
    }
    if(mencoes.members.size === 0) {
      if(usernamesDigitados[0] === '') {
        if (podeEnviarMsg) {
          const descEmbed = new Discord.MessageEmbed()
            .setColor(hex.blue2)
            .setTitle(`Como usar o ${config.prefix}${comando}`)
            .setDescription(`Modo de usar:\n**Mencionando o(s) usuário(s)** *${config.prefix}unmute @user1 @user2*\n**Pelo username ou apelido:** *${config.prefix}unmute username1 \\ apelido1*\nOBS: *O motivo para o unmute não é obrigatório, mas caso utilize, coloque-o entre crases ("\`")*`)
            .setTimestamp()
            .setFooter(`Sistema de ajuda ${client.user.username}`, client.user.displayAvatarURL())
          message.reply(descEmbed)
        } else if (podeAddReactions) {
          message.react('helpcircle:745759636589903922')
        }
        return;
      } else {
        for(let i = 0; i < usernamesDigitados.length; i++) {
          const usernameMembers = await message.guild.members.cache.filter(member => member.user.username.toLowerCase() === usernamesDigitados[i])
          const nicknameMembers = await message.guild.members.cache.filter(member => (member.nickname === null || member.nickname === undefined) ? member.nickname : member.nickname.toLowerCase() === usernamesDigitados[i])
          if(usernameMembers.size !== 0) {
            if(!verificacoes(usernameMembers))return;
            if(mutedRoles) {
              usernameMembers.map(member => member.roles.remove([mutedRoles]))
              if(podeManageMessages && i === usernamesDigitados.length - 1) {
                message.delete()
              } else if(podeEnviarMsg) {
                message.reply(`**${usernameMembers.map(member => member.user.username)[0]}** foi desmutado com sucesso!`)
              } else if (podeAddReactions) {
                message.react('circlecheck:745763762132484197')
              }
              return;
            }
          } else if(nicknameMembers.size !== 0) {
            if(!verificacoes(nicknameMembers))return;
            if(mutedRoles) {
              nicknameMembers.map(member => member.roles.remove([mutedRoles]))
              if(podeManageMessages && i === usernamesDigitados.length - 1) {
                message.delete()
              } else if(podeEnviarMsg) {
                message.reply(`**${nicknameMembers.map(member => member.user.username)[0]}** foi desmutado com sucesso!`)
              } else if (podeAddReactions) {
                message.react('circlecheck:745763762132484197')
              }
              return;
            }
          } else if(i === usernamesDigitados.length - 1) {
            if(podeEnviarMsg) {
              message.reply(`eu não conheço esse membro!`)
            } else if(podeAddReactions) {
              message.react('helpcircle:745759636589903922')
            }
          }
        }
        return;
      }
    }
    if(!verificacoes(mencoes.members))return;
    if(mutedRoles) {
      mencoes.members.map(member => member.roles.remove([mutedRoles]))
      if(podeManageMessages) {
        message.delete()
      } else if(podeEnviarMsg) {
        message.reply(`**${mencoes.members.map(member => member.user.username)[0]}** foi desmutado com sucesso!`)
      } else if (podeAddReactions) {
        message.react('circlecheck:745763762132484197')
      }
      return;
    }
  }
}