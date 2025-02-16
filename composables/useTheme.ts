import { ref } from 'vue'

export const useTheme = () => {
  const theme = ref('theme-default')

  const setTheme = (newTheme: string) => {
    theme.value = `theme-${newTheme}`
  }

  return {
    theme,
    setTheme
  }
}