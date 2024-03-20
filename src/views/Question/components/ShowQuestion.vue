<script lang="ts" setup>
import type { QuestionItemType } from '@/interface'
import { ref, type PropType } from 'vue'

const props = defineProps({
  item: {
    type: Object as PropType<QuestionItemType>,
    default: () => {
      return {
        correct: '',
        create_time: '',
        create_user: '',
        difficult: '',
        id: '',
        items: [],
        question_type: '',
        score: '',
        subject_id: '',
        title: ''
      }
    }
  },
  index: {
    type: Number,
    default: 0
  }
})
const questionItem = ref(props.item)
defineExpose({
  questionItem
})
</script>

<template>
  <div class="showQuestion-container">
    <div class="showQuestion-box">
      <div class="showQuestion-order" v-if="index">
        {{ index }}
      </div>
      <div class="showQuestion-content">
        <span v-html="questionItem.title" style="margin-bottom: 20px"></span>
        <div class="showQuestion-content-item">
          <span class="" v-for="item in questionItem.items" :key="item.prefix">
            {{ item.prefix }} . {{ item.content }}
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
