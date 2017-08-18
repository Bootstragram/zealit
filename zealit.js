const util = require('util')
const traverse = require('traverse')



const fnHasOwnProperty = Object.prototype.hasOwnProperty
const globalOption = {
    ignore: [
        'toJSON',
        'valueOf',
        'inspect',
        Symbol.toStringTag,
        util.inspect.custom,
    ].filter((e) => !!e),
    freeze: false,
    catch: false,
    clone: false,
    disable: false,
}



function getOption(option, idOption) {
    if (option[idOption] === undefined) {
        return zealit.option[idOption]
    }

    return option[idOption]
}

function zealOneObject(obj, localOption) {
    return new Proxy(obj, {
        get: (target, key) => {
            const v = target[key]
            const catchOption = getOption(localOption, 'catch')
            if (catchOption === true) {
                return v
            }

            if (v !== undefined) {
                return v
            }
            if (fnHasOwnProperty.call(target, key)) {
                return v
            }
            if (localOption.ignore.includes(key)) {
                return v
            }
            if (zealit.option.ignore.includes(key)) {
                return v
            }

            const msg = `zealit: property '${key}' is nonexistent`
            const err = new ReferenceError(msg)
            if (catchOption) {
                catchOption(err)
                return v
            }

            throw err
        },
    })
}

// create a zealous object
//  prevent getting nonexistent property
function zealit(obj, localOption={}) {
    const disabled = getOption(localOption, 'disable')
    if (disabled) {
        return obj
    }

    const listToIgnore = (localOption.ignore)
        ? (Array.isArray(localOption.ignore)
            ? localOption.ignore
            : [localOption.ignore])
        : []

    const mustFreeze = getOption(localOption, 'freeze')
    const fnFreeze = (mustFreeze) ? Object.freeze : ((e) => e)
    const mustClone = getOption(localOption, 'clone')
    const idFnTraverse = (mustClone) ? 'map' : 'forEach'

    return traverse(obj)[idFnTraverse](function (node) {
        const ignoreThat = (this.isRoot) ? listToIgnore : []
        this.after(() => {
            if (node !== null && typeof node === 'object') {
                const zealed = zealOneObject(node, {
                    ignore: ignoreThat,
                    catch: localOption.catch,
                })

                this.update(fnFreeze(zealed))
            }
        })

        return node
    })
}



zealit.option = globalOption
module.exports = zealit
