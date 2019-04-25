<template>
  <div class="home">
    <div class="box">
      <video ref="video" id="video" width="640" height="480" autoplay></video>
      <button id="snap" @click="capture">Snap Photo</button>
    </div>
    <div class="box" style="text-align: left">
      <select name="cameras" v-model="selectedCamera" @change="changeCamera">
        <option value="">Selecione</option>
        <option v-for="(camera, index) in cameras" :value="camera.deviceId" :key="index">Camera {{ index + 1}}</option>
      </select>
      <canvas ref="canvas" id="canvas"></canvas>
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
    // fancingMode: 'environment',
    cameras: [],
    selectedCamera: '',
    currentStream: '',
    video: {},
    canvas: {},
    captures: [],
  }),
  mounted() {
    this.video = this.$refs.video;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          this.cameras = devices.filter(device => {
            return device.kind === 'videoinput';
          });
        });
      this.setCurrentCamera();
    }
  },
  methods: {
    capture() {
      this.canvas = this.$refs.canvas;
      this.canvas.getContext('2d').drawImage(this.video, 0, 0, 640, 480);
      this.captures.push(canvas.toDataURL('image/png'));
    },
    changeCamera() {
      // console.log(`Você selecionou o device: ${this.selectedCamera}`);
      // this.video.stop();
      this.stopMediaTracks();
      this.setCurrentCamera();
    },
    setCurrentCamera() {
      const {
        selectedCamera,
        video
      } = this;

      const options = {
        video: true,
        audio: false
      }

      if (selectedCamera) {
        options.video = {
          deviceId: { exact: selectedCamera },
        }
      }

      if (video) {
        navigator.mediaDevices.getUserMedia(options).then((stream) => {
          this.currentStream = stream;
          this.video.srcObject = stream;
          this.video.play();
        });
      }
    },
    stopMediaTracks() {
      const {
        currentStream
      } = this;

      if (currentStream) {
        this.currentStream.getTracks().forEach(track => {
          track.stop();
        });
      }
    }
  },
};
</script>

<style lang="scss" scoped>
  .home {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;

    @media all and (min-width: 768px) {
      flex-direction: row;
    }
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
    // display: inline;
    padding: 5px;
  }
  button {
    margin: 1rem auto;
  }
</style>
