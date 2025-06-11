class Step {
    constructor({fps = 10, frames = [], loop = false, onStart, onUpdate, onStop}){
        this.frames = frames ?? [];
        this.frame = 0
        this.maxFrame = frames.length - 1
        this.fps = fps
        this.deltaFrame = 1000 / this.fps
        this.time = 0
        this.stopped = true
        this.loop = loop
        this.onUpdate = onUpdate
        this.onStart = onStart
        this.onStop = onStop
        this.children = []
    }
    addChildren(step){
        this.children.push(step)
    }
    startAnimation({onEnd = null, reverse = false} = {}){
        this.reverse = reverse
        this.onEnd = onEnd
        this.startTime = performance.now()
        this.prevTime = this.startTime
        this.stopped = false
        if(this.onStart) this.onStart()
        this.update()
        this.animate()
        for(let child of this.children) child.startAnimation({reverse})
    }
    isFinished(reverse){
        return reverse && this.frame === 0 || !reverse && this.frame === this.maxFrame
    }
    onEndAnimation(){
        console.log("animation ended")
        if(this.onEnd) this.onEnd()
    }
    stop(){
        this.stopped = true
        if(this.onStop) this.onStop()
        for(let child of this.children) child.stop()
    }
    animate(){
        if(this.stopped) return
        requestAnimationFrame( () => this.animate() )
        this.time = performance.now()
        if( this.time - this.prevTime >= this.deltaFrame){
            this.next()
            this.prevTime = this.time
        }
    }
    next(){
        if(this.loop){
            this.frame++
            if(this.frame > this.maxFrame) this.frame = 0
            else if(this.frame < 0) this.frame = this.maxFrame
        }
        else {
            if(this.reverse) this.frame--
            else this.frame++
            this.frame = Math.max( 0, Math.min(this.maxFrame, this.frame) )
            if(this.reverse && this.frame === 0){
                this.onEndAnimation()
                this.stopped = true
            }
            if(!this.reverse && this.frame === this.maxFrame){
                this.onEndAnimation()
                this.stopped = true
            }
        }
        this.update()
        console.log(`current frame ${this.frame} - ${this.frames[this.frame]}`)
    }
    update(){
        if(this.frames.length){
           this.onUpdate(this.frames[this.frame])
        }
    }
}

var Scroller = {
    stepIndex:0,
    steps:[],
    currentStep:null,
    playing: false,
    endingTimeout: null,
    prevDelta:0,
    wheelStarted:false,
    wheelType:"",
    active:false,
    init(steps){
        this.steps = steps
        window.addEventListener("wheel", this.onWheel.bind(this))
        this.currentStep = this.steps[0] ?? null
    },
    onWheel(e){
        if(!Scroller.active) return
        let wheelType
        if(Math.abs(this.prevDelta) >= Math.abs(e.deltaY)){
            this.wheelStarted = false
            wheelType = "inertia"
        }
        else {
            wheelType = "human"
            if(!this.wheelStarted){
                this.wheelStarted = true
            }
        }

        if(this.wheelType !== wheelType){
            this.wheelType = wheelType
        }
        this.prevDelta = e.deltaY
        if(!this.playing && this.wheelType === "human") this.animate(e.deltaY < 0)
    },
    animate(reverse = false){
        this.playing = true
        console.log("animation started")
        
        if(this.currentStep && this.currentStep.isFinished(reverse)){
            this.nextStep(reverse)
            this.currentStep.stop()
            this.currentStep = this.steps[this.stepIndex]
        }
        this.currentStep?.startAnimation({onEnd: () => {
            this.playing = false
        }, reverse})
    },
    nextStep(reverse){
        if(reverse) this.stepIndex--
        else this.stepIndex++
        this.stepIndex = Math.max( 0, Math.min(this.steps.length-1, this.stepIndex) )
        console.log(`step: ${this.stepIndex}`)
    }
}