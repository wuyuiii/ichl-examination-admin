<script lang="ts" setup>
import type { QuestionItemType } from '@/interface'
import type { PropType } from 'vue'

defineProps({
  item: {
    type: Object as PropType<QuestionItemType>,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <div class="showQuestion-container">
    <div class="showQuestion-box">
      <div class="showQuestion-order">
        {{ index + 1 }}
      </div>
      <div class="showQuestion-content">
        <span v-html="item.title"></span>
        <div class="showQuestion-content-item">
          <span
            class=""
            v-for="questionItem in item.items"
            :key="questionItem.prefix"
          >
            {{ questionItem.prefix }} . {{ questionItem.content }}
          </span>
        </div>
      </div>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.showQuestion-container {
  .showQuestion-box {
    display: flex;
    justify-content: space-around;

    .showQuestion-order {
      flex: 1;
      margin-right: 2.5rem;
    }

    .showQuestion-content {
      display: flex;
      flex-direction: column;
      align-content: flex-start;
      flex: 20;
      margin-right: 2.5rem;

      .showQuestion-content-item {
        padding-left: 1.25rem;

        span {
          margin: 0.25rem 1rem;
        }
      }
    }

    .showQuestion-del {
      flex: 1;
      margin-right: 2.5rem;
    }
  }
}
</style>
