const { execSync } = require('child_process')
const fs = require('fs')

const createProject = (argv) => {
    execSync(`
    yarn create next-app ${argv.name} -ts`,
        { stdio: 'inherit', cwd: './' });

    // install package lain yang diperlukan
    execSync(`
        cd ${argv.name} 
        yarn add @mantine/core @mantine/hooks @mantine/next @emotion/server @emotion/react @prisma/client lodash @types/lodash @hookstate/core react-icons
       `, {
        stdio: 'inherit',
        cwd: './'
    })

    // cek prisma , jika belum ada folder prisma maka akan menjalankan perintah prisma init
    if (!fs.existsSync(`./${argv.name}/prisma`)) {
        execSync(`cd ${argv.name} && npx prisma init`, {
            stdio: 'inherit',
            cwd: './'
        })
    }

    // manipulasi .env untuk set database
    const _env = require('dotenv').parse(fs.readFileSync(`./${argv.name}/.env`, 'utf8'))
    _env.DATABASE_URL = `"postgresql://${argv.user}:${argv.password}@localhost:5433/${argv.name}?schema=public"`
    const _data = _.keys(_env)
        .map((k) => `${k}=${_env[k]}`)
        .join('\n')

    // menyimpan pengaturan database
    fs.writeFileSync(`./${argv.name}/.env`, _data)


    console.log("success")
}

module.exports = createProject