#!/usr/bin/env node
const yargs = require('yargs');
const { execSync } = require('child_process')
const fs = require('fs');
const _ = require('lodash');
const createProject = require('../src');
const git = require('../src');

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
        handler: createProject
    })
    .command({
        command: "env-db-generate",
        describe: "generate env database database",
        builder: {
            user: {
                describe: "username database",
                type: "string",
                demandOption: true
            },
            password: {
                describe: "password database",
                type: "string",
                demandOption: true
            }
        }
    })
    .command({
        command: "git",
        describe: "git",
        builder: {
            push: {
                describe: "push",
                type: "boolean",
                alias: 'p'
            }
        },
        handler: git
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