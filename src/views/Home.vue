<template>
  <div>
    <div style="display: flex; justify-content: center; margin: 0 10px;">
      <label style="float: left" for="width">width</label>
      <input name="width" type="tel" v-model="mask.width" style="width: 50px;">
      <label style="float: left" for="height">height</label>
      <input name="height" type="tel" v-model="mask.height" style="width: 50px;">
      <label style="float: left" for="x">x</label>
      <input name="x" type="tel" v-model="mask.x" style="width: 50px;">
      <label style="float: left" for="y">y</label>
      <input name="y" type="tel" v-model="mask.y" style="width: 50px;">
    </div>
    <Camera :mask="mask"/>
  </div>
</template>

<script>
const Camera = () => import(/* webpackChunkName: "camera" */ './Camera');


export default {
  name: 'home',
  components: { Camera },
  data: () => ({
    mask: {
      width: '80%',
      height: '45%',
      x: '10%',
      y: '22.5%'
    }
  })
}
</script>

<style lang="scss" scoped>

</style>
