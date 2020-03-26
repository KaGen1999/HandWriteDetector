<template>
  <div class="canvas">
    <button @click="resetCanvas">清空canvas</button>
    <canvas width="500px" height="300px" ref="canvas"></canvas>
  </div>
</template>

<script>
  export default {
    name: "HelloWorld",
    components: {},
    data() {
      return {};
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        let canvas = this.$refs.canvas
        let ctx = canvas.getContext("2d")
        let startPosition = []
        let isdraw = false
        ctx.fillStyle = "#999999"
        ctx.fillRect(0, 0, 500, 300)
        ctx.lineWidth = 1
        canvas.onmousedown = res => {
          //指针在canvas上点击
          isdraw = true;
          startPosition[0] = res.offsetX
          startPosition[1] = res.offsetY
          drawLine(res.offsetX,res.offsetY)
          console.log(res)
        };
        canvas.onmouseup = res => {
          //指针在canvas上放开
          if (!isdraw) return;
          clear()
        };
        canvas.onmouseout = res => {
          //指针移出canvas
          if (!isdraw) return;
          clear()
        };
        canvas.onmousemove = res => {
          //指针在canvas移动
          if (!isdraw) return;
          drawLine(res.offsetX,res.offsetY)
        };
        function drawLine(X,Y) {
          //画图
          if (!isdraw) return;
          ctx.beginPath();
          console.log(X,Y)
          ctx.moveTo(startPosition[0],startPosition[1])
          startPosition = [X,Y]
          ctx.lineTo(X,Y);
          ctx.stroke();
          ctx.save()
        }
        function clear() {
          isdraw = false;
          startPosition = []
        }
      },
      resetCanvas() {
        //清空canvas
        let canvas = this.$refs.canvas
        let ctx = canvas.getContext("2d")
        let startPosition = []
        let isdraw = false
        ctx.fillStyle = "#999999"
        ctx.fillRect(0, 0, 500, 300)
      }
    }
  };
</script>
<style lang='scss' scoped>
  canvas {

  }
</style>
