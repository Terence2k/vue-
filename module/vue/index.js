
/**
 * showPool
 * 
 * [
 *  [
 *      dom,
 *      {
 *          type: if / show
 *          prop:data
 *      }, 
 *  ]
 * ]
 * 
 */

const Vue = (function () {

    function Vue(options) {
        //生命周期
        const recycles = {
            beforCreate: options.beforCreate?.bind(this) || function () { },
            create: options.create?.bind(this) || function () { },
            beforMounted: options.beforMounted?.bind(this) || function () { },
            mounted: options.mounte?.bind(this) || function () { },
        }

        this.$data = options.data()
        this.$el = document.querySelector(options.el)

        recycles.beforCreate()
        this.init(this, options.template, options.methods, recycles)

    }

    Vue.prototype.init = function (vm, template, methods, recycles) {
        console.log(recycles, 'recycles')
        recycles.create()

        var container = document.createElement('div')
        container.innerHTML = template

        var showPool = new Map()
        var eventPool = new Map()

        initData(vm, showPool)
        initPool(container, showPool, eventPool, methods)
        bindEvent(vm, eventPool)

        recycles.beforMounted()
        render(vm, showPool, container)
        recycles.mounted()


    }

    function initData(vm, showPool) {
        var _data = vm.$data

        for (var k in _data) {

            (function (key) {

                Object.defineProperty(vm, key, {
                    get() {
                        return vm.$data[key]
                    },
                    set(value) {
                        vm.$data[key] = value
                        update(vm, key, showPool)
                    }
                })

            })(k)
        }
    }

    function bindEvent(vm, eventPool) {
        console.log(eventPool, 'eventPool')
        for (let [dom, fnName] of eventPool) {
            vm[fnName.name] = fnName
            // console.log(dom,fnName.name)
            dom.addEventListener('click', vm[fnName.name].bind(vm), false)
        }

    }



    function initPool(container, showPool, eventPool, methods) {
        var _allNode = container.getElementsByTagName('*')
        console.log(_allNode)
        var dom = null

        for (var i = 0; i < _allNode.length; i++) {
            dom = _allNode[i]
            // console.log(dom)

            var vIfData = dom.getAttribute('v-if')

            var vShowData = dom.getAttribute('v-show')
            var vEvent = dom.getAttribute('@click')

            if (vIfData) {
                showPool.set(dom, {
                    type: 'if',
                    prop: vIfData
                })
                dom.removeAttribute('v-if')
            } else if (vShowData) {
                showPool.set(dom, {
                    type: 'show',
                    prop: vShowData
                })
                dom.removeAttribute('v-show')

            }

            if (vEvent) {
                eventPool.set(dom, methods[vEvent])
                dom.removeAttribute('@click')

            }

        }
        console.log(container.innerHTML)

    }


    function render(vm, showPool, container) {
        var _data = vm.$data,
            el = vm.$el

        for (var [dom, info] of showPool) {
            switch (info.type) {
                case 'if':
                    console.log(dom, info, !_data[info.prop], 'info')
                    info.comment = document.createComment(['v-if'])
                    !_data[info.prop] && dom.parentNode.replaceChild(info.comment, dom)
                    break;
                case 'else-if':
                    break;

                case 'show':
                    !_data[info.prop] && (dom.style.display = 'none')
                    break;

                default: break;
            }
        }
        el.appendChild(container)
    }

    function update(vm, key, showPool) {
        var _data = vm.$data

        for (let [dom, info] of showPool) {
            if (info.prop === key) {
                switch (info.type) {
                    case 'if':
                        // console.log(dom.parentNode ,info.comment.parentNode)
                        _data[info.prop] ?
                            info.comment.parentNode.replaceChild(dom, info.comment)
                            : dom.parentNode.replaceChild(info.comment, dom)
                        break;
                    case 'show':

                        dom.style.display = (_data[info.prop] ? '' : 'none');
                        console.log(_data[info.prop], dom.style.display)
                        break;
                    default:
                        break;

                }
            }
        }
    }

    return Vue

})()

console.log(Vue)

export {
    Vue
}