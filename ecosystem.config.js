const path = require('path')

const host = process.env.HOST
const user = process.env.USER
const token = process.env.TOKEN

module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [

    // First application
    {
      name: 'IngressMissionArtsBot',
      script: 'src/index.js',
      env: {
        COMMON_VARIABLE: 'true',
        DATA_PATH: path.join(__dirname, './ingress-medal-arts.json'),
      },
      env_production: {
        NODE_ENV: 'production',
        DATA_PATH: path.join(__dirname, '../ingress-medal-arts.json'),
      },
    },

    {
      name: 'IngressMissionArtsBotSchedule',
      script: 'src/schedule.js',
      env_production: {
        NODE_ENV: 'production',
        DATA_PATH: path.join(__dirname, '../ingress-medal-arts.json'),
      },
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user,
      host,
      ref: 'origin/master',
      repo: 'https://github.com/Witcher42/ingress-mission-arts-bot.git',
      path: '/root/ingress-mission-arts-bot',
      'post-deploy': `npm install --production && export TOKEN=${token} && pm2 reload ecosystem.config.js --env production`,
    },
  },
}
