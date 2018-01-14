# pre-commit

## Install
```bash
npm install githook-pre-commit
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