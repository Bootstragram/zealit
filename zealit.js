const util = require('util')
const traverse = require('traverse')



const fHasOwnProperty = Object.prototype.hasOwnProperty
const globalOption = {
    ignore: [
        'toJSON',
        'valueOf',
        'inspect',
        Symbol.toStringTag,
        util.inspect.custom,
    ].filter((e) => !!e),
}



function zealOneObject(obj, localOption) {
    return new Proxy(obj, {
        get: (target, key) => {
            const v = target[key]

            if (v !== undefined) {
                return v
            }
            if (fHasOwnProperty.call(target, key)) {
                return v
            }
            if (localOption.ignore.includes(key)) {
                return v
            }
            if (globalOption.ignore.includes(key)) {
                return v
            }

            throw new ReferenceError(`zealit: property '${key}' is nonexistent`)
        },
    })
}

// create a zealous object
//  prevent getting nonexistent property
function zealit(obj, localOption={}) {
    const listToIgnore = (localOption.ignore)
        ? (Array.isArray(localOption.ignore)
            ? localOption.ignore
            : [localOption.ignore])
        : []

    return traverse(obj).map(function (node) {
        const ignoreThat = (this.isRoot) ? listToIgnore : []
        this.after(() => {
            if (node !== null && typeof node === 'object') {
                const zealed = zealOneObject(node, {
                    ignore: ignoreThat,
                })

                const mustFreeze = localOption.freeze
                const fFreeze = (mustFreeze) ? Object.freeze : ((e) => e)
                this.update(fFreeze(zealed))
            }
        })

        return node
    })
}



zealit.option = globalOption
module.exports = zealit
