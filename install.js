const path = require('path')
const fs = require('fs')

const exec = cmd => execSync(cmd).toString()

const root = path.resolve(__dirname, '..', '..')
// const root = path.resolve(__dirname)
const exists = fs.existsSync || path.existsSync

const getGitFolderPath = currPath => {
    const git = path.resolve(currPath, '.git')

    if (!exists(git) || !fs.lstatSync(git).isDirectory()) {
        console.log('pre-commit: Not found .git folder in', git)

        var newPath = path.resolve(currPath, '..')

        // Stop if we on top folder
        if (path === newPath) {
            return null
        }

        return getGitFolderPath(newPath)
    }

    return git
}

const git = getGitFolderPath(root)

if (!git) {
    console.log('pre-commit: Not found any .git folder for installing pre-commit hook')
    return
}

const hooks = path.resolve(git, 'hooks')
const precommit = path.resolve(hooks, 'pre-commit')

if (!exists(hooks)) fs.mkdirSync(hooks)

if (exists(precommit) && !fs.lstatSync(precommit).isSymbolicLink()) {
    console.log('pre-commit: Detected an existing git pre-commit hook')
    fs.writeFileSync(precommit + '.old', fs.readFileSync(precommit))
    console.log('pre-commit: Old pre-commit hook backuped to pre-commit.old')
}

// delete pre-commit
try {
    fs.unlinkSync(precommit)
} catch (e) {}

const preCommitPath = path.resolve(__dirname, 'pre-commit')
const preCommitTpl = `
    #!/usr/bin/env bash

    ${preCommitPath}
    RESULT=$?
    [ $RESULT -ne 0 ] && exit 1
    exit 0
`

try {
    fs.writeFileSync(precommit, preCommitTpl)
} catch (e) {
    console.error('pre-commit: Failed to create the hook file in your .git/hooks folder because:')
    console.error('pre-commit: ' + e.message)
    console.error('pre-commit: The hook was not installed.')
}

// change file permission
try {
    fs.chmodSync(precommit, '777')
} catch (e) {
    console.error('pre-commit: chmod 0777 the pre-commit file in your .git/hooks folder because:')
    console.error('pre-commit: ' + e.message)
}