<script lang="ts" setup>
import { ref } from 'vue'
import { correctionPaperAPI, getAnswerAPI } from '@/api/answer'
import { useRoute, useRouter } from 'vue-router'
import { useOptionStore } from '@/stores'
import { ElMessage } from 'element-plus'
import type { Answer, AnswerDataType } from '@/interface'

const DoRightEnums: { [key: number]: { type: string; text: string } } = {
  0: {
    type: 'danger',
    text: '错误'
  },
  1: {
    type: 'success',
    text: '正确'
  },
  2: {
    type: 'warning',
    text: '待批改'
  }
}
const route = useRoute()
const router = useRouter()
const optionStore = useOptionStore()

const answerData = ref<AnswerDataType>()

const getAnswer = async () => {
  const { data: res } = await getAnswerAPI(route.query.id as any)
  if (res.status !== 200) {
    return ElMessage.error(res.message)
  }
  answerData.value = res.data
}
getAnswer()

// tag题目锚点跳转
const tagClick = (val: number) => {
  const p: any = document.querySelectorAll('.question-title')
  const container: any = document.querySelector('.judge-container')
  for (let i = 0; i < p.length; i++) {
    if (+p[i].getAttribute('data-id') === val) {
      const items = p[i].offsetTop - 200
      return container.scroll(0, items)
    }
  }
}

// 提交
const submit = async () => {
  const correction = answerData.value?.answer.answerItems.some((item) => {
    return item.doRight === 2 && item.score === null
  })
  if (correction) {
    return ElMessage.error('还有未批改题目！！！')
  }
  const { data: res } = await correctionPaperAPI(
    answerData.value?.answer as Answer
  )
  if (res.status === 200) {
    ElMessage.success(res.message)
  } else {
    ElMessage.error(res.message)
  }
  const index = optionStore.tagBar.findIndex(
    (item) => item.current === route.fullPath
  )
  router.push(optionStore.tagBar[index].back)
  optionStore.tagBar.splice(index, 1)
}
</script>

<template>
  <div class="judge-container" v-if="answerData">
    <div class="judge-order">
      <el-card style="height: 100%" shadow="never">
        <template #header>
          <h3 class="judge-order-title">{{ answerData?.paper.paperTitle }}</h3>
          <div class="judge-order-info">
            <span>
              <i class="judge-order-info-text"
                >{{ $t('ANSWER.ANSWER_SCORE') }} :</i
              >
              {{ answerData?.answer.score }}
            </span>
            <span>
              <i class="judge-order-info-text">{{ $t('ANSWER.TIME') }} :</i>
              {{ answerData?.answer.doTime }}
            </span>
            <span>
              <i class="judge-order-info-text"
                >{{ $t('ANSWER.ANSWER_STU') }} :</i
              >
              {{ answerData?.answer.answerUser }}
            </span>
          </div>
        </template>
        <!-- 题目跳转 -->
        <div class="judge-order-question">
          <el-tag
            class="judge-order-question-item"
            v-for="(item, index) in answerData?.answer.answerItems"
            :key="item.id"
            :type="DoRightEnums[item.doRight].type"
            @click="tagClick(item.itemOrder)"
          >
            {{ index + 1 }}
          </el-tag>
        </div>
        <div class="judge-order-submit" v-if="!answerData.answer.status">
          <el-button type="primary" style="width: 70%" @click="submit">{{
            $t('ANSWER.SUBMIT_CORRECT')
          }}</el-button>
        </div>
      </el-card>
    </div>

    <div class="judge-content">
      <el-card style="min-height: 100%" shadow="never">
        <div
          class="judge-content-titleItem"
          v-for="(titleItem, index) in answerData?.paper.titleItems"
          :key="index"
        >
          <h3>{{ titleItem.name }}</h3>
          <div
            class="judge-content-titleItem-question"
            v-for="questionItem in titleItem.questionItem"
            :key="questionItem.id"
          >
            <p class="question-title" :data-id="questionItem.itemOrder">
              {{ questionItem.itemOrder }}.
              <span v-html="questionItem.title"></span>
            </p>
            <div class="question-item">
              <el-radio-group
                v-if="
                  questionItem.question_type === 1 ||
                  questionItem.question_type === 3
                "
                v-model="
                  answerData.answer.answerItems[questionItem.itemOrder - 1]
                    .content
                "
                disabled
              >
                <el-radio-button
                  v-for="item in questionItem.items"
                  :key="item.prefix"
                  :value="item.prefix"
                  size="large"
                >
                  {{ item.prefix }}. {{ item.content }}
                </el-radio-button>
              </el-radio-group>
              <el-checkbox-group
                v-if="questionItem.question_type === 2"
                size="large"
                v-model="
                  answerData.answer.answerItems[questionItem.itemOrder - 1]
                    .contentArray
                "
                disabled
              >
                <el-checkbox-button
                  v-for="item in questionItem.items"
                  :key="item.prefix"
                  :value="item.prefix"
                >
                  {{ item.prefix }}. {{ item.content }}
                </el-checkbox-button>
              </el-checkbox-group>
              <el-form
                v-if="questionItem.question_type === 4"
                :model="
                  answerData.answer.answerItems[questionItem.itemOrder - 1]
                    .contentArray
                "
              >
                <el-form-item
                  v-for="(item, index) in questionItem.items"
                  :key="item.prefix"
                  :label="item.prefix"
                >
                  <el-input
                    v-model="
                      answerData.answer.answerItems[questionItem.itemOrder - 1]
                        .contentArray[index]
                    "
                    style="width: 25rem"
                    disabled
                  />
                </el-form-item>
              </el-form>
              <el-input
                v-if="questionItem.question_type === 5"
                type="textarea"
                resize="none"
                class="question-item-textarea"
                v-model="
                  answerData.answer.answerItems[questionItem.itemOrder - 1]
                    .content
                "
                disabled
              />
              <div class="question-item-answer">
                <div class="question-item-result">
                  {{ $t('ANSWER.RESULT') }} :
                  <el-tag
                    :type="
                      DoRightEnums[
                        answerData.answer.answerItems[
                          questionItem.itemOrder - 1
                        ].doRight
                      ].type
                    "
                    style="margin-left: 0.625rem"
                    >{{
                      DoRightEnums[
                        answerData.answer.answerItems[
                          questionItem.itemOrder - 1
                        ].doRight
                      ].text
                    }}</el-tag
                  >
                </div>
                <div class="question-item-right-answer">
                  {{ $t('QUESTION.STANDART_ANSWER') }} :
                  <span>{{ questionItem.correct.toString() }}</span>
                </div>
                <div class="question-item-score">
                  {{ $t('ANSWER.ANSWER_SCORE') }} :
                  <span>
                    {{
                      answerData?.answer.answerItems[questionItem.itemOrder - 1]
                        .score
                    }}
                  </span>
                </div>
                <div class="question-item-quesiton-score">
                  {{ $t('ANSWER.QUESTION_SCORE') }} :
                  <span>
                    {{
                      answerData?.answer.answerItems[questionItem.itemOrder - 1]
                        .questionScore
                    }}
                  </span>
                </div>
                <div class="question-item-difficult">
                  {{ $t('QUESTION.DIFFICULTY') }} :
                  <el-rate v-model="questionItem.difficult" disabled />
                </div>
                <div
                  class="question-item-teacher-score"
                  v-if="
                    DoRightEnums[
                      answerData.answer.answerItems[questionItem.itemOrder - 1]
                        .doRight
                    ].text === '待批改'
                  "
                >
                  <span style="color: #e6a23c">
                    {{ $t('ANSWER.CORRECT') }} :
                  </span>
                  <el-input-number
                    v-model="
                      answerData.answer.answerItems[questionItem.itemOrder - 1]
                        .score
                    "
                    :min="0"
                    :max="
                      answerData.answer.answerItems[questionItem.itemOrder - 1]
                        .questionScore
                    "
                  ></el-input-number>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.judge-container {
  display: flex;
  height: 100%;
  overflow: auto;
  .judge-order {
    max-width: 17.5rem;
    min-width: 12.5rem;
    height: 100%;
    margin-right: 1.25rem;
    position: sticky;
    top: 0;
    .judge-order-title {
      margin-bottom: 1.25rem;
    }
    .judge-order-info {
      display: flex;
      flex-direction: column;
      font-size: 0.875rem;
      .judge-order-info-text {
        color: #989898;
        margin-right: 0.625rem;
      }
    }
    .judge-order-question {
      margin-bottom: 1.25rem;
      display: flex;
      flex-wrap: wrap;
      .judge-order-question-item {
        width: 1.875rem;
        height: 1.875rem;
        margin-right: 0.625rem;
        margin-bottom: 0.625rem;
        cursor: pointer;
      }
    }
    .judge-order-submit {
      display: flex;
      justify-content: center;
    }
  }
  .judge-content {
    flex: 5;
    margin-bottom: 1.25rem;
    .judge-content-titleItem {
      margin-bottom: 1.25rem;
      .judge-content-titleItem-question {
        padding-left: 2.5rem;
        margin-top: 1.25rem;
        .question-item {
          padding: 1.25rem 0 0 1.25rem;
          .question-item-textarea {
            width: 40% !important;
            &:deep(.el-textarea__inner) {
              height: 120px;
            }
          }
          .question-item-answer {
            display: flex;
            flex-direction: column;
            min-height: 9.375rem;
            justify-content: space-around;
            margin-top: 1.5rem;
            font-size: 0.875rem;
            .question-item-result,
            .question-item-difficult {
              display: flex;
              align-items: center;
            }
          }
          // 解决多选框开启禁用后，选中的选项没有样式的问题
          .el-checkbox-button {
            --el-radio-button-disabled-checked-fill: var(
              --el-border-color-extra-light
            );
            &.is-checked:deep(.el-checkbox-button__inner) {
              background-color: var(--el-radio-button-disabled-checked-fill);
            }
          }
        }
      }
    }
  }
}
</style>
