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

      <video
        ref="video"
        id="video"
        width="768"
        height="1024"
        autoplay
        :style="image ? 'display: none;' : 'display:block;'"
      ></video>

      <canvas
        ref="canvas"
        id="canvas"
        width="768"
        height="1024"
        :style="!image ? 'display: none;' : 'display:block;'"
      ></canvas>

      <div class="controls">
        <select name="cameras" v-model="selectedCamera" @change="changeCamera">
          <option value="environment" selected>Câm. traseira</option>
          <option value="user">Câm. frontal</option>
        </select>

        <button id="snap" @click="capture" :style="image ? 'display: none;' : 'display:block;'">
          Capturar
        </button>

        <button id="send" @click="send" :disabled="image === ''">
          {{ loading ? 'Enviando...' : 'Enviar' }}
        </button>

        <button id="clear" @click="image = ''" :style="!image ? 'display: none;' : 'display:block;'">
          Nova foto
        </button>
      </div>
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
    image: '',
    loading: false,
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
      this.canvas.getContext('2d').drawImage(this.video, 0, 0, 768, 1024);
      this.image = canvas.toDataURL('image/jpeg');
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
      try {
        const {
          image: base64Img
        } = this;

        this.loading = true;

        const blob = this.blobTransform(base64Img);

        const formData = new FormData();

        formData.set('image', blob, `cnh_rg_frente.jpg`);
        formData.set('type', 1);
        formData.set('variation', 'CNH');

        const response = await storeImage(formData);

        alert('Imagem enviada com sucesso!');
      } catch (err) {
        alert('Ops, deu erro! :(')
      } finally {
        this.loading = false;
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
  position: absolute;
  width: 320px;
  height: 400px;
  background-color: #eee;
}

li {
  display: inline;
  padding: 5px;
}

.controls {
  display: flex;
  justify-content: center;
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
