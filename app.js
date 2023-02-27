import { Vue } from './module/vue/index.js'

const app = new Vue({
    template: `
        <img v-if='isShowImg' src="./2.jpg" alt="">
        <img v-show='isShowImg2' src="./b-i.png" alt="">
        <h1>v-if & v-show & recycles cyc</h1>
        <button @click='handleBtn1'>img1</button>
        <button @click='handleBtn2'>img2</button>
    `,
    data: function () {
        return {
            isShowImg: false,
            isShowImg2: false
        }
    },
    methods: {
        handleBtn1() {
            this.isShowImg = !this.isShowImg
        },
        handleBtn2() {
            this.isShowImg2 = !this.isShowImg2
        }
    },
    el: '#app'
})

console.log(app)
