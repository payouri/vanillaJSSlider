import './sass/styles.scss';
import { DOMUtils } from './js/utils';
const { setStyles, attachEvts } = DOMUtils;
class CarouselModule {
    constructor(root = undefined, { ...o} = {}) {
        this.root;
        this.images = [];
        this.children = [];
        this.controls = [];
        this.current = undefined;
        this.size = {
            width: undefined,
            height: undefined,
        }
        this.animation = {
            duration: 300,
            type: 'translate',
            easing: 'ease',
        }
        this.dragged = {
            threshold: this.root.dataset.dragThreshold || o.dragThreshold || this.size.width / 4,
            status: false,
            dragStart: 0,
        }
        this.controlsCallbacks = {
            handleMouse: event => {

                if (event.type == 'mousedown' || event.type == 'touchstart') {
                    this.dragged.status = true;
                    this.dragged.dragStart = event.touches && event.touches[0] ? event.touches[0].clientX : event.clientX;
                    setStyles(this.root, {
                        cursor: 'grabbing'
                    })
                } else if (event.type == 'mouseup' || event.type == 'mouseleave' || event.type == 'mouseout' || event.type == 'touchcancel' || event.type == 'touchend') {
                    this.dragged.status = false
                    this.setActiveState(this.current);
                    setStyles(this.root, {
                        cursor: 'grab'
                    });
                } else if (this.dragged.status && (event.type == 'mousemove' || event.type == 'touchmove')) {

                    setStyles(this.root, {
                        cursor: 'grabbing'
                    });
                    this.images.map((i, index) => {
                        if (event.touches && event.touches[0]) {
                            setStyles(i.tag, {
                                transform: `translateX(${(index - this.current) * this.size.width + (event.touches[0].clientX - this.dragged.dragStart)}px) scale(1)`,
                            });
                        } else if (event.clientX) {
                            setStyles(i.tag, {
                                transform: `translateX(${(index - this.current) * this.size.width + (event.touches && event.touches[0]?event.touches[0].clientX:event.clientX - this.dragged.dragStart)}px) scale(1)`,
                            });
                        }
                    })

                    if (Math.abs(event.touches && event.touches[0] ? event.touches[0].clientX : event.clientX - this.dragged.dragStart) > this.size.width / 4) {
                        if (event.touches && event.touches[0]) {
                            if (event.touches[0].clientX - this.dragged.dragStart < 0)
                                this.setCurrent(this.current + 1)
                            else
                                this.setCurrent(this.current - 1)

                        } else if (event.clientX) {
                            if (event.clientX - this.dragged.dragStart < 0)
                                this.setCurrent(this.current + 1)
                            else
                                this.setCurrent(this.current - 1)

                        }
                        this.setActiveState(this.current);
                        return this.dragged.status = false;
                    }
                }
            },
            handleControlClick: ({ ...o} = {}) => {
                const {
                    action,
                    ...params
                } = o;
                if (action == 'goto') {
                    this.setCurrent(params.image);
                    this.setActiveState(params.image);
                }
            },
            handleContextMenu: (event, ...args) => {

                event.preventDefault();

                console.log(args);
            }
        }
        const { active, animation = {}, start, loop, width, height, size } = o;
        this.root = this.setRoot(root);
        if (width || height || size)
            this.size = this.setSize({
                width,
                height,
                size
            });
        else
            this.size = this.setSize(this.root.dataset);
        this.current = this.setCurrent(active || this.root.dataset.active);
        this.animation = this.setAnimation(animation);
        this.setActiveState(this.current);
    }
    setAnimation(obj) {
        const {
            duration = 300, easing = 'linear', type = 'translateX'
        } = obj
        return this.animation = {
            duration,
            easing,
            type
        }
    }
    setCurrent(index) {
        let n = Number(index);
        if (!isNaN(n) && n < this.images.length && n >= 0) {
            return this.current = n;
        }
    }
    setRoot(r) {
        if (r instanceof HTMLElement) {
            this.setImages(r);
            return this.root = r;
        }
    }
    setSize({ width, height, size} = {}) {
        let newSize = {
            width: 400,
            height: 400,
        };
        const w = Number(width),
            h = Number(height),
            s = Number(size);
        if (!isNaN(s) || !isNaN(h) || !isNaN(w)) {
            newSize = {
                width: !isNaN(s) ? s : !isNaN(w) ? w : this.size.width ? this.size.width : !isNaN(h) ? h : undefined,
                height: !isNaN(s) ? s : !isNaN(h) ? h : this.size.height ? this.size.height : !isNaN(w) ? w : undefined,
            }
        } else if (this.root.parentNode) {
            const container = this.root.parentNode,
                containerBR = container.getBoundingClientRect();
            newSize = {
                width: containerBR.width,
                height: containerBR.height,
            }
        }
        return this.size = newSize;
    }
    setImages(root) {
        if (root && root instanceof HTMLElement) {
            const container = root.querySelector('[data-area="images-container"]');
            if (container != null && container.children.length > 0) {
                const images = container.children;
                for (let i = 0; i < container.children.length; i++) {
                    const img = images[i],
                        {
                            src = '',
                            title = ''
                        } = img.dataset;
                    this.images.push({
                        tag: img,
                        title: title,
                        src: src,
                        active: false,
                    })
                }
            } else {
                return this.images = [];
            }
        }
    }
    setChildren(root) {
        if (root && root instanceof HTMLElement) {
            const container = root.querySelector('[data-area="children-container"');
            if(container != null && container.children.length > 0) {
                const { children } = container;
                this.children = Array.from(children).map(el => ({tag: el, active: false,}));
            }
        }
    }
    setControls(control) {
        const generateControl = (id) => {
                const ctrl = document.createElement('div');
                ctrl.dataset.image = id;
                ctrl.dataset.action = 'goto';
                return ctrl;
            },
            generateControlArea = (type) => {
                ctrls = document.createElement('div');
                ctrls.dataset.area = 'controls';
                return ctrls;
            }

        let ctrls = this.root.querySelector('[data-area="controls"]');
        if (ctrls == null) {
            ctrls = generateControlArea();
        }
        if (!this.root.contains(ctrls)) {
            
            if (control == 'indicator') {
                for (let i = 0; i < this.images.length; i++) {
                    const ctrl = generateControl(i);
                    ctrl.dataset.type = 'indicator';
                    ctrl.dataset.status = this.images[i].active ? 'active' : 'inactive';
                    this.controls.push({
                        DOMElem: ctrl,
                        type: 'indicator'
                    });
                    ctrls.appendChild(ctrl);
                }
            }
            this.root.appendChild(ctrls);
        }
    }
    setActiveState(n) {
        const updateImages = (newIndex) => {
                this.images.map((img, i) => {
                    setStyles(img.tag, {
                        transform: `translateX(${(i - newIndex) * this.size.width}px)`,
                    })
                });
            },
            updateControls = (type, newIndex) => {
                this.controls.map((ctrl) => {
                    if (type == 'indicator' && ctrl.type == 'indicator') {
                        ctrl.DOMElem.dataset.status = 'inactive';
                        if (ctrl.DOMElem.dataset.image == newIndex) {
                            ctrl.DOMElem.dataset.status = 'active';
                        }
                    }
                })
            };
        let index = Number(n);
        if (!isNaN(index) && this.images[index]) {
            this.images.map(i => i.active = false);
            this.images[index].active = true;
            this.root.dataset.active = index;
            updateImages(index);
            updateControls('indicator', index);
            return this.current = index;
        }
    }
    setControlsCallback(ctrl, cb) {
        if (typeof this.controlsCallbacks[ctrl] == 'function' &&
            typeof cb == 'function') {
            this.controlsCallbacks[ctrl] = cb;
        }
    }
    setupListeners() {
        attachEvts(this.root, this.controlsCallbacks.handleMouse, ['mousedown', 'mousemove', 'mouseup', 'mouseleave', 'mouseout', 'touchstart', 'touchmove', 'touchend', 'touchcancel'], false);
        attachEvts(this.root, e => (this.controlsCallbacks.handleContextMenu(e)), ['contextmenu'], true)
        for (let ctrl of this.controls) {
            attachEvts(ctrl.DOMElem, () => this.controlsCallbacks.handleControlClick(ctrl.DOMElem.dataset), ['click'], false);
        }
    }
    render() {
        const container = this.root.querySelector('[data-area="images-container"]');
        setStyles(this.root, {
            cursor: 'grab',
            height: `${this.size.height}px`,
            width: `${this.size.width}px`,
        })
        setStyles(container, {
            height: `${this.size.height}px`,
            width: `${this.size.width}px`,
            position: 'relative',
            overflow: 'hidden'
        })
        const imageStyles = {
            height: `${this.size.height}px`,
            width: `${this.size.width}px`,
            objectFit: 'cover',
        };
        this.images.map((i, index) => {
            const DOMImageElem = i.tag;
            setStyles(DOMImageElem, {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                // transform: `translateX(${(index - this.current)*this.size.width}px) scale(${Math.abs(index - this.current)})`,
                transition: `transform ${this.animation.duration}ms ${this.animation.easing}`,
                willChange: 'transform',
                userSelect: 'none',
                pointerEvents: 'none',
                overflow: 'hidden'
            })
            DOMImageElem.style.zIndex = 1;
            if (i.active) {
                DOMImageElem.dataset.status = 'active';
                DOMImageElem.style.zIndex = 10;
            }
            if (DOMImageElem.nodeName == 'IMAGE') {
                setStyles(DOMImageElem, imageStyles)
                DOMImageElem.src = i.src;
            } else {
                if(i.src) {
                    const img = new Image;
                    setStyles(img, imageStyles)
                    img.src = i.src;
                    DOMImageElem.appendChild(img)
                }
            }
        });
        if (this.root.dataset.indicators == 'on') {
            this.setControls('indicator');
        }
        if (this.root.dataset.controls == 'on') {
            this.setupListeners();
        }
    }
}
// export default (
//     document.addEventListener('DOMContentLoaded', () => {
//         const DOMElements = document.querySelectorAll('[data-module="slider"]');
//         DOMElements.forEach(element => VanillaCarousel(element));
//         CarouselModule(o)
//     })
// )()
export default CarouselModule