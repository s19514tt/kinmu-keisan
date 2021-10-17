<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>賃金計算</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <HelloWorld />
      </v-container>
    </v-main>
  </v-app>
</template>
<style>
body {
  background-color: #f6f6f4;
}
</style>
<script lang="ts">
import Vue from 'vue';
import HelloWorld from './components/HelloWorld.vue';

export default Vue.extend({
  name: 'App',

  components: {
    HelloWorld,
  },

  data: () => ({
    //
  }),
});
</script>
