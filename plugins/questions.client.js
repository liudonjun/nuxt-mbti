import questionsData from '~/assets/data/questions.json'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      questionsData
    }
  }
})