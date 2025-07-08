import questionsData from '~/assets/data/questions_v2.json'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      questionsData
    }
  }
})