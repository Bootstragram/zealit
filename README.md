Prevent getting nonexistent property by throwing a ReferenceError, using ES6 proxies.<br>
In other words, throw an error if reading an object property that doesn't exist.<br>

Avoid typo or incomplete renaming/refactor.<br>
Usefull to combine with `Object.freeze` to declare constants.

## Usage
```javascript
const zealit = require('zealit')

const ref = { foo: true, bar: undefined }
const zealed = zealit(ref)

ref.foo // true
ref.bar // undefined
ref.baz // undefined

zealed.foo // true
zealed.bar // undefined
zealed.baz // throws a ReferenceError

const myConstants = zealit({
    PI: 3.14159265,
    nbMsInOneDay: 1000 * 60 * 60 * 24,
}, { freeze: true })
myConstants.PI // 3.14159265
myConstants.Pi // throws a ReferenceError
myConstants.nbMsInOneDay = 39 // throws a TypeError

const foo = zealit({}, { ignore: 'bar' })
foo.bar // undefined
foo.baz // throws a ReferenceError
```

## Methods
### zealit(obj[, option])
Clones `obj` recursively and returns a _zealed_ version of the object.

 - `obj` &lt;any> Any JavaScript primitive or Object
 - `option` &lt;Object>
    - `freeze` &lt;boolean> If `true`, the object is _freezed_ as the same time via `Object.freeze`. Defaults to `false`.
    - `ignore` &lt;String|Array> Properties to ignore, no exception thrown if these properties are read while those doesn't exist

## Installation
Using npm:
```
$ npm install zealit --save
```

In Node.js:
```javascript
const zealit = require('zealit')
```

## Todo
 - option to disable recursion?
 - option to customize `listSpecialProperty`
 - default/global option
 - test with more node version (v6.7.0 at the moment)
 - provide source code via github
