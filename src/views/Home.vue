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
      <div class="controls">
        <select name="cameras" v-model="selectedCamera" @change="changeCamera">
          <option value="environment" selected>Câm. traseira</option>
          <option value="user">Câm. frontal</option>
        </select>
        <button id="snap" @click="capture">Capturar</button>
        <button id="send" @click="send" :disabled="image === ''">Enviar</button>
      </div>
    </div>
    <div class="box">
      <canvas ref="canvas" id="canvas" width="800" height="600"></canvas>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';
import { storeImage } from '@/services/api';

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
    },
    async send() {
      const {
        image: base64Img
      } = this;

      try {
        const blob = this.blobTransform(base64Img);

        const formData = new FormData();

        formData.set('image', blob, `cnh_rg_frente.jpg`);
        formData.set('type', 1);
        formData.set('variation', 'CNH');

        const response = await storeImage(formData);

        alert('Imagem enviada com sucesso!');
      } catch (err) {
        console.error;
      }
    },
    blobTransform(base64Img) {
      const imgArr = base64Img.split(',');

      const byteString = atob(imgArr[1]);
      const mimeString = imgArr[0].split(':')[1].split(';')[0];
      const ia = new Uint8Array(byteString.length);

      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ia], {type:mimeString});
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
  width: 480px;
  height: 320px;
  background-color: #eee;
}

li {
  display: inline;
  padding: 5px;
}

button, select {
  margin: 1rem .5rem 1rem auto;
  height: 2rem;
  background-color: #009688;
  color: #fff;
  border: none;
  border-radius: 2px;
  cursor: pointer;
}

button:disabled {
  background-color: #ddd;
  color: #333;
}
</style>
