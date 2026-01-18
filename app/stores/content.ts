import { defineStore } from 'pinia'

export const useContentStore = defineStore('content', () => {
  const description = ref('')
  const mediaFileData = ref<string | null>(null)
  const scheduledDate = ref<Date | null>(null)

  const mediaFile = computed((): File | null => {
    console.log('Computing mediaFile, mediaFileData:', mediaFileData.value)
    if (!mediaFileData.value) return null
    // Convert base64 back to File
    const parts = mediaFileData.value.split(',')
    if (parts.length !== 2) {
      console.log('Invalid mediaFileData format')
      return null
    }
    const mime = parts[0] as string
    const data = parts[1] as string
    const byteString = atob(data)
    const arrayBuffer = new ArrayBuffer(byteString.length)
    const uintArray = new Uint8Array(arrayBuffer)
    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i)
    }
    const type = mime.split(':')[1]?.split(';')[0] || 'application/octet-stream'
    const blob = new Blob([uintArray], { type })
    const file = new File([blob], 'uploaded-file', { type })
    console.log('Created File:', file)
    return file
  })

  const setMediaFile = (file: File | null) => {
    console.log('setMediaFile called with:', file)
    if (!file) {
      mediaFileData.value = null
      console.log('mediaFileData set to null')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      mediaFileData.value = reader.result as string
      console.log('mediaFileData set to base64:', mediaFileData.value?.substring(0, 50) + '...')
    }
    reader.readAsDataURL(file)
  }

  return {
    description,
    mediaFileData,
    scheduledDate,
    mediaFile,
    setMediaFile
  }
}, {
  persist: true
})
