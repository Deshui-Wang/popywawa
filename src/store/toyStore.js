import { defineStore } from 'pinia'
import { supabase } from '../supabase'

export const useToyStore = defineStore('toy', {
  state: () => ({
    stories: [],
    userAddedToys: [],
    loading: false
  }),
  actions: {
    // 从云端获取所有故事
    async fetchStories() {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!error) {
        this.stories = data
      }
    },

    // 从云端获取所有玩偶
    async fetchToys() {
      const { data, error } = await supabase
        .from('toys')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!error) {
        this.userAddedToys = data
      }
    },

    async addToy(toy) {
      this.loading = true
      let imageUrl = ''

      try {
        // 1. 上传图片到 Supabase Storage
        if (toy.imageFile) {
          const file = toy.imageFile
          const fileExt = file.name.split('.').pop()
          const fileName = `${Math.random()}-${Date.now()}.${fileExt}`
          const filePath = `toys/${fileName}`

          const { error: uploadError } = await supabase.storage
            .from('popy-images')
            .upload(filePath, file)

          if (uploadError) throw uploadError

          // 2. 获取图片的公开访问链接
          const { data: publicData } = supabase.storage
            .from('popy-images')
            .getPublicUrl(filePath)
          
          imageUrl = publicData.publicUrl
        }

        // 3. 将信息（含图片链接）存入数据库
        const { data, error } = await supabase
          .from('toys')
          .insert([{
            name: toy.name,
            image: imageUrl,
            desc: toy.desc,
            brand: toy.brand,
            series: toy.series
          }])
          .select()
        
        if (!error) {
          this.userAddedToys.unshift(data[0])
        }
      } catch (err) {
        console.error('Upload process failed:', err)
      } finally {
        this.loading = false
      }
    },

    async addStory(story) {
      const { data, error } = await supabase
        .from('stories')
        .insert([{
          title: story.title,
          excerpt: story.excerpt
        }])
        .select()
      
      if (!error) {
        this.stories.unshift(data[0])
      } else {
        console.error('Error adding story:', error)
      }
    }
  }
})
