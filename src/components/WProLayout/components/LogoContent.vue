<template>
  <div
    id="logo"
    :class="
      layout === 'mix' ? 'wd-pro-global-header-logo' : 'wd-pro-sider-logo'
    "
    :style="showTitle ? null : { minWidth: 'auto' }"
  >
    <a @click="menuHeaderClick">
      <img :src="logo" alt="" />
      <template v-if="showTitle">
        <slot v-if="$slots.headerTitleRender" name="headerTitleRender" ></slot>
        <h1 v-else>{{ title }}</h1>
      </template>
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import logo from '/@/assets/logo.png'

export default defineComponent({
  name: 'Logo',
  props: {
    title: {
      type: String,
      default: 'wd Pro Admin',
      required: false
    },
    logo: {
      type: String,
      required: false,
      default: logo
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    },
    layout: {
      type: String,
      default: 'mix',
      required: false
    }
  },
  setup(_, { emit }) {
    return {
      menuHeaderClick: () => {
        emit('menuHeaderClick')
      }
    }
  }
})
</script>
