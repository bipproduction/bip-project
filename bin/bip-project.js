#!/usr/bin/env node
const yargs = require('yargs');
const { execSync } = require('child_process')
const fs = require('fs');
const _ = require('lodash');


// mendapatkan nama branch
const branchName = execSync('git rev-parse --abbrev-ref HEAD')
    .toString()
    .trim();

yargs
    .command({
        command: "set-user",
        describe: "set user and password",
        builder: {
            username: {
                describe: "username",
                demandOption: true,
                type: 'string',
                alias: 'u'
            },
            password: {
                describe: "password",
                demandOption: true,
                type: 'string',
                alias: 'p'
            }
        },
        handler: (argv) => {
            const env = require('../src');
            env.set('USR', argv.username);
            env.set('PWD', argv.password);
            console.log("SUCCESS")
        }
    })
    .command({
        command: "get-user",
        describe: "get user and password",
        builder: {

        },
        handler: (argv) => {
            const env = require('../src');
            console.log(env.get('USR'));
            console.log(env.get('PWD'));
        }
    })
    .command({
        command: "create-project",
        describe: "create project",
        builder: {
            name: {
                describe: "name",
                demandOption: true,
                type: 'string',
                alias: 'n'
            },
            user: {
                describe: "user",
                demandOption: true,
                type: 'string',
                alias: 'u'
            },
            password: {
                describe: "password",
                demandOption: true,
                type: 'string',
                alias: 'p'
            }
        },
        handler: (argv) => {
            // execSync(`
            // yarn create next-app ${argv.name} -ts`,
            //     { stdio: 'inherit', cwd: './' });

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
    })
    .check((argv) => {
        // cek apakah command dipanggil
        if (_.isEmpty(argv._)) {
            yargs.showHelp();
        }
        return true
    })
    .group([
        "username -u        string",
        "password -p        string"
    ], "set-user")
    .strict()
    .argv