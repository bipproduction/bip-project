const yargs = require('yargs')
const execSync = require('child_process').execSync

/**
 * 
 * @param {yargs.ArgumentsCamelCase<any>} argv 
 */
async function git(argv) {
    const branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    if (argv.push) {
        execSync(`git add -A && git commit -m "auto push" && git push origin ${branchName}`)
    }
}

module.exports = git