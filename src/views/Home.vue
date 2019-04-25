<template>
  <div class="home">
    <div class="box">
      <video ref="video" id="video" width="640" height="480" autoplay></video>
      <button id="snap" @click="capture">Snap Photo</button>
    </div>
    <div class="box">
      <canvas ref="canvas" id="canvas" width="640" height="480"></canvas>
      <ul>
        <li v-for="(capture, i) in captures" :key="i">
          <img :src="capture" height="50"/>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'home',
  components: {},
  data: () => ({
    video: {},
    canvas: {},
    captures: [],
  }),
  mounted() {
    this.video = this.$refs.video;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        this.video.srcObject = stream;
        this.video.play();
      });
    }
  },
  methods: {
    capture() {
      this.canvas = this.$refs.canvas;
      const context = this.canvas.getContext('2d').drawImage(this.video, 0, 0, 640, 480);
      this.captures.push(canvas.toDataURL('image/png'));
    },
  },
};
</script>

<style lang="scss" scoped>
  .home {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }
  .box {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
  }
  #video {
    background-color: #000000;
    width: 100%;
    height: auto;
  }
  #canvas {
    display: none;
  }
  li {
    display: inline;
    padding: 5px;
  }
  button {
    margin: 1rem auto;
  }
</style>
