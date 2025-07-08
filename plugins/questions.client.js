import questionsData from '~/assets/data/questions_v1.json'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      questionsData
    }
  }
})