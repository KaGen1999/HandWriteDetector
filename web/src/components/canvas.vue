<template>
  <div class="canvas">
    <h1>手写数字识别</h1>
    <div class="contain">
      <canvas id="main"></canvas>
      <!--<div>输入结果</div>-->
      <canvas id="input" style="border:1px solid" width="140" height="140"></canvas>
      <tbody class="tb">
      <tr>
        <td>数字</td>
        <td>线性回归模型</td>
        <td>卷积神经网络</td>
      </tr>
      <tr v-for="(item,index) in output1">
        <td>{{index}}</td>
        <td :class="[indexofMax1==index?'class1':'class2']">{{item}}</td>
        <td :class="[indexofMax2==index?'class1':'class2']">{{output2[index]}}</td>
      </tr>
      </tbody>
    </div>
    <button @click="clear">清空画板</button>
  </div>
</template>

<script>
  import {post} from "../request/http";

  export default {
    name: "v_canvas",
    components: {},
    data() {
      return {
        output1: Array(10).fill('0 %'),
        output2: Array(10).fill('0 %'),
        indexofMax1:null,
        indexofMax2:null,
      };
    },
    mounted() {
      this.show();
    },
    methods: {
      show() {
        this.canvas = document.getElementById('main');
        this.input = document.getElementById('input');
        this.canvas.width = 449; // 16 * 28 + 1
        this.canvas.height = 449; // 16 * 28 + 1
        this.ctx = this.canvas.getContext('2d');
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.initialize();
      },
      initialize() {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, 449, 449);
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(0, 0, 449, 449);
        this.ctx.lineWidth = 0.05;
        for (var i = 0; i < 27; i++) {
          this.ctx.beginPath();
          this.ctx.moveTo((i + 1) * 16, 0);
          this.ctx.lineTo((i + 1) * 16, 449);
          this.ctx.closePath();
          this.ctx.stroke();
          this.ctx.beginPath();
          this.ctx.moveTo(0, (i + 1) * 16);
          this.ctx.lineTo(449, (i + 1) * 16);
          this.ctx.closePath();
          this.ctx.stroke();
        }
        this.ctx.lineWidth = 5;
      },
      onMouseDown(e) {
        this.canvas.style.cursor = 'default';
        this.drawing = true;
        this.prev = this.getPosition(e.clientX, e.clientY);
      },

      onMouseUp() {
        this.drawing = false;
        this.drawInput();
      },

      onMouseMove(e) {
        if (this.drawing) {
          var curr = this.getPosition(e.clientX, e.clientY);
          this.ctx.lineWidth = 16;
          this.ctx.lineCap = 'round';
          this.ctx.beginPath();
          this.ctx.moveTo(this.prev.x, this.prev.y);
          this.ctx.lineTo(curr.x, curr.y);
          this.ctx.stroke();
          this.ctx.closePath();
          this.prev = curr;
        }
      },

      getPosition(clientX, clientY) {
        var rect = this.canvas.getBoundingClientRect();
        return {
          x: clientX - rect.left,
          y: clientY - rect.top
        };
      },
      clear() {
        this.initialize();
      },
      drawInput() {
        var that = this;
        var ctx = this.input.getContext('2d');
        var img = new Image();
        img.onload = () => {
          var inputs = [];
          var small = document.createElement('canvas').getContext('2d');
          small.drawImage(img, 0, 0, img.width, img.height, 0, 0, 28, 28);
          var data = small.getImageData(0, 0, 28, 28).data;
          for (var i = 0; i < 28; i++) {
            for (var j = 0; j < 28; j++) {
              var n = 4 * (i * 28 + j);
              inputs[i * 28 + j] = (data[n + 0] + data[n + 1] + data[n + 2]) / 3;
              ctx.fillStyle = 'rgb(' + [data[n + 0], data[n + 1], data[n + 2]].join(',') + ')';
              ctx.fillRect(j * 5, i * 5, 5, 5);
            }
          }
          let d = {i: JSON.stringify(inputs)};
          post('http://xxxxxx/mnist', d)
            .then(res => {
              console.log(res.data);
              var output1 = res.data.output1;
              var output2 = res.data.output2;
              var max1 = Math.max(...output1);
              var max2 = Math.max(...output2);
              var indexOfMax1 = output1.indexOf(max1);
              var indexOfMax2 = output2.indexOf(max2);
              for (var i = 0; i < output1.length; i++) {
                output1[i] = (output1[i] * 100).toFixed(2) + ' %';
                output2[i] = (output2[i] * 100).toFixed(2) + ' %';
              }
              this.output1 = output1;
              this.output2 = output2;
              this.indexofMax1 = indexOfMax1;
              this.indexofMax2 = indexOfMax2;
              // console.log(max1, that.indexOfMax1, max2, that.indexOfMax2);
            })
        };
        img.src = this.canvas.toDataURL();
      }
    }
  };
</script>
<style lang='scss' scoped>
  .contain{
    max-height: 500px;
  }
  #input{
    display: inline-block;
    vertical-align: center;
    margin: 30px;
  }
  .tb {
    display: inline-block;
    vertical-align: top;
    text-align: center;
    border: 1px solid black;
    /*width: 100%;*/
    border-collapse:collapse;
  }

  .tb td {
    padding: 5px 5px 10px 5px;
    border: 1px solid black;
  }
  .class1{
    background-color: rgba(225,113,255,0.44);
  }
</style>
