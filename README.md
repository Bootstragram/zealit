Prevent getting nonexistent property by throwing a ReferenceError, using ES6 proxies.<br>
In other words, throw an error if reading an object property that doesn't exist.<br>

Avoid typo or incomplete renaming/refactor.<br>
Usefull to combine with `Object.freeze` to declare constants.

## Usage
```javascript
const zealit = require('zealit')

const ref = { foo: true, bar: undefined }
ref.foo // true
ref.bar // undefined
ref.baz // undefined

// default behavior
const zealed = zealit(ref)
zealed.foo // true
zealed.bar // undefined, no Error thrown
zealed.baz // throws a ReferenceError

// "freeze" option
const myConstants = zealit({
    PI: 3.14159265,
    nbMsInOneDay: 1000 * 60 * 60 * 24,
}, { freeze: true })
myConstants.PI // 3.14159265
myConstants.Pi // throws a ReferenceError
myConstants.nbMsInOneDay = 39 // throws a TypeError

// "ignore" option
const foo = zealit({}, { ignore: 'bar' })
foo.bar // undefined, no Error thrown
foo.baz // throws a ReferenceError

// "clone" option
const bar = { baz: { yo: 1 } }
const baz = zealit(bar, { clone: true })
bar.baz.YO // undefined as bar was deeply cloned by zealit
baz.baz.YO // throws a ReferenceError

// "strict" option
const foo = zealit({ x: undefined }, { strict: false })
foo.x // undefined, no Error thrown
foo.y // throws a ReferenceError
const bar = zealit({ x: undefined }, { strict: true })
bar.x // throws a ReferenceError
bar.y // throws a ReferenceError
```

## Methods and options
### zealit(obj[, option])
Updates `obj` recursively and returns a _zealed_ version of the object.

 - `obj` &lt;any> Any JavaScript primitive or Object
 - `option` &lt;Object>
    - `freeze` &lt;boolean> If `true`, the object is _freezed_ as the same time via `Object.freeze`. If provided, this local option will take precedence over the global option.
    - `ignore` &lt;String|Array> Properties to ignore, no exception will be thrown for these properties as they keep behaving like vanilla JavaScript properties. The current _zealed_ object will not throw exception for properties listed locally nor properties of the global list `zealit.option.ignore`
    - `catch` &lt;boolean|Function> to override the default behavior (throwing a ReferenceError). If provided, this local option will take precedence over the global option.
        - `fn(err)`: calls `fn` function with the ReferenceError as argument in place of throw ReferenceError
        - `false`:  throw ReferenceError (default behavior)
        - `true`: doesn't throw ReferenceError
    - `disable` &lt;boolean> If `true`, `zealit` does nothing. If provided, this local option will take precedence over the global option.
    - `strict` &lt;boolean> If `true`, `zealit` throws a ReferenceError if property exists with the `undefined` value.

### zealit.option
Object to expose global options, applies to all _zealed_ objects.

 - `freeze` &lt;boolean> If `true`, `zealit` will freeze objects as the same time via `Object.freeze`. Defaults to `false`. If provided, the local option will take precedence over this global option.
    ```javascript
    zealit.option.freeze = true
    const foo = zealit({ bar: true })
    foo.bar = false // throws a TypeError
    ```

 - `ignore` &lt;Array> Properties to ignore, no exception will be thrown for these properties as they keep behaving like vanilla JavaScript properties. Applies to all _zealed_ objects, even those was instancied before an update of `zealit.option.ignore`
    ```javascript
    const foo = zealit({ bar: true })
    foo.baz // throws a ReferenceError

    zealit.option.ignore.push('bar')
    foo.baz // undefined
    ```

 - `catch` &lt;boolean|Function> to override the default behavior (throwing a ReferenceError). If provided, the local option will take precedence over this global option.
    - `fn(err)`: calls `fn` function with the ReferenceError as argument in place of throw ReferenceError
    - `false`:  throw ReferenceError (default behavior)
    - `true`: doesn't throw ReferenceError
    ```javascript
    const foo = zealit({ bar: true })
    zealit.option.catch = (err) => { console.log('gotcha', err) }
    foo.baz // return undefined and console.log('gotcha', ReferenceError)
    ```

- `disable` &lt;boolean> If `true`, `zealit` does nothing, simply return `obj` itself.
    ```javascript
    zealit.option.disable = true
    const foo = { bar: true }

    // same thing
    const baz = zealit(foo)
    const baz = foo
    ```

- `strict` &lt;boolean> If `true`, `zealit` throws a ReferenceError if property has the `undefined` value, even if property exists. By default, `zealit` throws a ReferenceError only if property doesn't exist.
    ```javascript
    zealit.option.strict = true
    const foo = zealit({ bar: undefined })
    foo.bar // throws a ReferenceError
    ```

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
 - explain limitation (Promise, .length, lodash, hidden properties)
 - more documentation about "clone" option (lose hidden properties vs update and keep those)
 - option to _rezeal_ a property
 - test with more node version (v6.7.0 at the moment)
 - option to disable recursion?
