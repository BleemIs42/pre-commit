# pre-commit

## Install
```bash
npm install pre-commit-hook
``` 

## Use 
package.json
```js
// add pre-commit
{
    "scripts": {
        "echo": "echo \'pre-commit\' cool!"
    },
    // command in scripts
    "pre-commit": ["echo"]
}
```