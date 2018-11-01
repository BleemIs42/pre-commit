const path = require('path')
const fs = require('fs')

const root = path.resolve(__dirname, '..', '..')
// const root = path.resolve(__dirname)
const exists = fs.existsSync || path.existsSync

const getGitFolderPath = currPath => {
    const git = path.resolve(currPath, '.git')

    if (!exists(git) || !fs.lstatSync(git).isDirectory()) {
        console.log('githook-pre-commit: Not found .git folder in', git)

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
    console.log('githook-pre-commit: Not found any .git folder for installing githook-pre-commit hook')
    return
}

const hooks = path.resolve(git, 'hooks')
const preCommit = path.resolve(hooks, 'pre-commit')

if (!exists(hooks)) fs.mkdirSync(hooks)

if (exists(preCommit) && !fs.lstatSync(preCommit).isSymbolicLink()) {
    console.log('githook-pre-commit: Detected an existing git githook-pre-commit hook')
    fs.writeFileSync(preCommit + '.old', fs.readFileSync(preCommit))
    console.log('githook-pre-commit: Old githook-pre-commit hook backuped to githook-pre-commit.old')
}

// delete githook-pre-commit
try {
    fs.unlinkSync(preCommit)
} catch (e) {}

const preCommitPath = path.resolve(__dirname, 'pre-commit').replace(/\\/g, '/')
const preCommitTpl = `#!/usr/bin/env bash

${preCommitPath}
RESULT=$?
[ $RESULT -ne 0 ] && exit 1
exit 0
`

try {
    fs.writeFileSync(preCommit, preCommitTpl)
} catch (e) {
    console.error('githook-pre-commit: Failed to create the hook file in your .git/hooks folder because:')
    console.error('githook-pre-commit: ' + e.message)
    console.error('githook-pre-commit: The hook was not installed.')
}

// change file permission
try {
    fs.chmodSync(preCommit, '777')
} catch (e) {
    console.error('githook-pre-commit: chmod 0777 the githook-pre-commit file in your .git/hooks folder because:')
    console.error('githook-pre-commit: ' + e.message)
}