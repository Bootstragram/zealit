const util = require('util')
const traverse = require('traverse')



const fHasOwnProperty = Object.prototype.hasOwnProperty
const globalListPropertyToIgnore = [
    'toJSON',
    'valueOf',
    'inspect',
    Symbol.toStringTag,
    util.inspect.custom,
].filter((e) => !!e)



function zealOneObject(obj, option) {
    const localListToIgnore = option.ignore.concat(globalListPropertyToIgnore)

    return new Proxy(obj, {
        get: (target, key) => {
            const v = target[key]

            if (v !== undefined) {
                return v
            }
            if (fHasOwnProperty.call(target, key)) {
                return v
            }
            if (localListToIgnore.includes(key)) {
                return v
            }

            throw new ReferenceError(`zealit: property '${key}' is nonexistent`)
        },
    })
}

// create a zealous object
//  prevent getting nonexistent property
function zealit(obj, option={}) {
    const listToIgnore = (option.ignore)
        ? (Array.isArray(option.ignore) ? option.ignore : [option.ignore])
        : []

    return traverse(obj).map(function (node) {
        const ignoreThat = (this.isRoot) ? listToIgnore : []
        this.after(() => {
            if (node !== null && typeof node === 'object') {
                const zealed = zealOneObject(node, {
                    ignore: ignoreThat,
                })
                const fFreeze = (option.freeze) ? Object.freeze : ((e) => e)
                this.update(fFreeze(zealed))
            }
        })

        return node
    })
}



module.exports = zealit
