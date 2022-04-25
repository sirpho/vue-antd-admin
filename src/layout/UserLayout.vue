<template>
  <div id="gx-user-layout">
    <div class="container">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </div>
</template>
