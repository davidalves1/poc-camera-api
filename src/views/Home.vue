<template>
  <div class="home">
    <div class="box">
      <svg id="svgLayer" width="320" height="400">
        <mask id="maskLayer">
          <rect width="100%" height="100%" fill="#fff" style="opacity: .8;"></rect>
          <!-- <text x="8%" y="55%" id="info">DAFT CREATION</text> -->
          <rect id="document-model" width="80%" height="45%" x="10%" y="22.5%"></rect>
        </mask>

        <rect id="masked" width="100%" height="100%" fill="#fff"></rect>
      </svg>
      <video ref="video" id="video" width="800" height="600" autoplay></video>
      <button id="snap" @click="capture">Snap Photo</button>
      <select name="cameras" v-model="selectedCamera" @change="changeCamera">
        <option value="environment" selected>Câm. traseira</option>
        <option value="user">Câm. frontal</option>
      </select>
    </div>
    <div class="box">
      <canvas ref="canvas" id="canvas" width="800" height="600"></canvas>
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
    cameras: [],
    selectedCamera: 'environment',
    currentStream: false,
    video: {},
    canvas: {},
    image: ''
  }),
  mounted() {
    this.video = this.$refs.video;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      this.setCurrentCamera();
    }
  },
  methods: {
    capture() {
      this.canvas = this.$refs.canvas;
      this.canvas.getContext('2d').drawImage(this.video, 0, 0, 800, 600);
      this.image = canvas.toDataURL('image/png');
    },
    changeCamera() {
      this.stopMediaTracks();
      this.setCurrentCamera();
    },
    setCurrentCamera() {
      const { selectedCamera, video } = this;

      const options = {
        video: true,
        audio: false
      };

      if (selectedCamera) {
        options.video = {
          // deviceId: { exact: selectedCamera },
          facingMode: selectedCamera
        };
      }

      if (
        video &&
        navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia
      ) {
        navigator.mediaDevices.getUserMedia(options).then(stream => {
          this.currentStream = stream;
          this.video.srcObject = stream;
          this.video.play();
        });
      }
    },
    stopMediaTracks() {
      const { currentStream } = this;

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
  margin: 10px 0;
  box-sizing: border-box;
  background-color: cadetblue;
}

#video {
  background-color: #eee;
  width: 320px;
  height: 400px;
  position: absolute;
}

#document-model {
  fill: #000;
  stroke: #fff;
  stroke-width: 3;
  border-radius: 3px;
}

#svgLayer {
  z-index: 1;
}

#masked {
  mask: url("#maskLayer");
}

#canvas {
  // display: none;
  width: 100%;
  height: 480px;
  background-color: #eee;
}

li {
  display: inline;
  padding: 5px;
}

button {
  margin: 1rem auto;
}
</style>
