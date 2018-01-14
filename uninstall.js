const path = require('path')
const fs = require('fs')

const root = path.resolve(__dirname, '..', '..')
// const root = path.resolve(__dirname)

const exists = fs.existsSync || path.existsSync

const git = path.resolve(root, '.git')
const preCommit = path.resolve(git, 'hooks', 'pre-commit')

if (!exists(preCommit)) return

if (!exists(preCommit + '.old')) {
    fs.unlinkSync(preCommit);
} else {
    fs.writeFileSync(preCommit, fs.readFileSync(preCommit + '.old'));
    fs.chmodSync(preCommit, '755');
    fs.unlinkSync(preCommit + '.old');
}