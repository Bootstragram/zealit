'use strict' // eslint-disable-line strict, lines-around-directive

const zealit = require('./zealit')



/* eslint-disable no-unused-vars, no-unused-expressions, no-console */
{
    const foo = zealit({ bar: true })
    let test = foo.bar
    let err
    try {
        test = foo.baz
    }
    catch (_err) {
        err = _err
        const messageShouldBe = "zealit: property 'baz' is nonexistent"
        if (err.message !== messageShouldBe) {
            throw new Error('test failed')
        }
    }
    if (!err) {
        throw new Error('test failed')
    }

    foo.bar = false
    if (foo.bar !== false) {
        throw new Error('test failed')
    }
}



{
    const qux = zealit({ bar: true }, { freeze: true })
    let err = null
    try {
        qux.bar = false
    }
    catch (_err) {
        err = _err
    }
    if (!err || qux.bar !== true) {
        throw new Error('test failed')
    }
}



{
    let err = null
    const myConstants = Object.freeze(zealit({
        PI: 3.14159265,
    }))
    let test = myConstants.PI // 3.14159265
    try {
        test = myConstants.Pi // throws a ReferenceError
    }
    catch (_err) {
        err = _err
        const messageShouldBe = "zealit: property 'Pi' is nonexistent"
        if (err.message !== messageShouldBe) {
            throw new Error('test failed')
        }
    }
    if (!err) {
        throw new Error('test failed')
    }

    err = null
    try {
        myConstants.PI = 12 // throws a TypeError
    }
    catch (_err) {
        err = _err
    }
    if (!err) {
        throw new Error('test failed')
    }

    err = null
    try {
        zealit({ a: { b: { c: true } } }).a.b.cc
    }
    catch (_err) {
        err = _err
    }
    if (!err) {
        throw new Error('test failed')
    }
}



{
    let err = null
    try {
        zealit({ a: true }).b
    }
    catch (_err) {
        err = _err
    }
    if (!err) {
        throw new Error('test failed')
    }
}

{
    let err = null
    try {
        const z = zealit({ a: true }, { ignore: 'b' })
        z.a
        z.b
        z.c
    }
    catch (_err) {
        err = _err
    }
    if (!err || err.message !== "zealit: property 'c' is nonexistent") {
        throw new Error('test failed')
    }
}

{
    let err = null
    try {
        const z = zealit({ a: true }, { ignore: ['b'] })
        z.a
        z.b
        z.c
    }
    catch (_err) {
        err = _err
    }
    if (!err || err.message !== "zealit: property 'c' is nonexistent") {
        throw new Error('test failed')
    }
}



{
    const foo = zealit({ bar: true })
    Promise.resolve(foo)
        .catch((_err1) => _err1)
        .then((_err1) => {
            if (!_err1) {
                console.log(new Error('test failed'))
                process.exit(1)
            }
        })
        .then(() => {
            zealit.option.ignore.push('then')
            return Promise.resolve(foo)
                .catch((_err2) => _err2)
                .then((_err2) => {
                    if (_err2 && _err2 instanceof Error) {
                        console.log(new Error('test failed'))
                        process.exit(1)
                    }
                })
        })
        .catch(() => {
            console.log(new Error('test failed'))
            process.exit(1)
        })
}



{
    const test1 = zealit({ bar: true })
    let err = null
    try {
        test1.bar = false
    }
    catch (_err) {
        err = _err
    }
    if (err || test1.bar !== false) {
        throw new Error('test failed')
    }
}

{
    zealit.option.freeze = true
    const test2 = zealit({ bar: true })
    let err = null
    try {
        test2.bar = false
    }
    catch (_err) {
        err = _err
    }
    if (!err || test2.bar !== true) {
        throw new Error('test failed')
    }
}

{
    const test3 = zealit({ bar: true }, { freeze: false })
    let err = null
    try {
        test3.bar = false
    }
    catch (_err) {
        err = _err
    }
    if (err || test3.bar !== false) {
        throw new Error('test failed')
    }
}
