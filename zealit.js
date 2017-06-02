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
    freeze: false,
    catch: false,
    clone: false,
}



function zealOneObject(obj, localOption) {
    return new Proxy(obj, {
        get: (target, key) => {
            const v = target[key]
            const catchOption = (localOption.catch === undefined)
                ? globalOption.catch
                : localOption.catch
            if (catchOption === true) {
                return v
            }

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
    const listToIgnore = (localOption.ignore)
        ? (Array.isArray(localOption.ignore)
            ? localOption.ignore
            : [localOption.ignore])
        : []

    const mustFreeze = (localOption.freeze === undefined)
        ? globalOption.freeze
        : localOption.freeze
    const fFreeze = (mustFreeze) ? Object.freeze : ((e) => e)

    const mustClone = (localOption.clone === undefined)
        ? globalOption.clone
        : localOption.clone
    const fTraverse = (mustClone) ? 'map' : 'forEach'

    return traverse(obj)[fTraverse](function (node) {
        const ignoreThat = (this.isRoot) ? listToIgnore : []
        this.after(() => {
            if (node !== null && typeof node === 'object') {
                const zealed = zealOneObject(node, {
                    ignore: ignoreThat,
                    catch: localOption.catch,
                })

                this.update(fFreeze(zealed))
            }
        })

        return node
    })
}



zealit.option = globalOption
module.exports = zealit
