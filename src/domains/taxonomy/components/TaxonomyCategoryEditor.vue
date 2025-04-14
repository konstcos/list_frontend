<template>
  <div>
    <Dialog v-model:visible="modalOpen" modal header="Редактор категории" :style="{ width: '25rem' }" @hide="closeModal">


      <div v-if="modalOpen">
        <div v-if="categoryEditor" class="w-full px-2">
          <Textarea
            v-if="categoryEditor.id === 0"
            v-model="categoryEditor.slug"
            rows="1"
            required
            placeholder="slug"
            fluid />

          <Textarea
            v-model="categoryEditor.title"
            rows="1"
            required
            placeholder="title"
            fluid />

          <Textarea
            v-model="categoryEditor.description"
            rows="4"
            required
            placeholder="description"
            fluid />
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <Button type="button" label="Закрыть" size="small" severity="secondary" @click="closeModal"></Button>
        <Button type="button" label="Сохранить" size="small" severity="success" @click="saveCategory"></Button>
      </div>

    </Dialog>
  </div>
</template>

<script>
import CategoryRepository from "../repositories/TaxonomyCategoryRepository.js";
// import LinkUseCase from "../use_case/LinksUseCase.js";
// import LinkEntity from "../entities/LinkEntity.js";


export default {
  name: 'TaxonomyCategoryEditor',
  setup() {
    const categoryRepository = new CategoryRepository();
    return {categoryRepository};
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    category: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      modalOpen: this.value,
      categoryEditor: {
        id: 0,
        slug: '',
        title: '',
        description: '',
      },
      loading: false,
    }
  },
  watch: {
    modelValue(newValue) {
      if (newValue) {
        this.openModal();
      } else {
        this.closeModal();
      }
    },
    modalOpen(newValue) {
      if (newValue) {
        this.categoryEditor.id = this.category.id;
        this.categoryEditor.slug = this.category.slug;
        this.categoryEditor.title = this.category.title;
        this.categoryEditor.description = this.category.description;
      }
    }
  },
  methods: {
    openModal() {
      this.modalOpen = true;
      this.clearCategoryData();
    },
    closeModal() {
      this.modalOpen = false;
      this.$emit('update:modelValue', false);
    },

    /**
     * Сохраняем данные.
     */
    async saveCategory() {
      this.loading = true;
      const result = await this.categoryRepository.saveCategory({
        id: this.categoryEditor.id,
        slug: this.categoryEditor.slug,
        title: this.categoryEditor.title,
        description: this.categoryEditor.description,
      });
      this.loading = false;
      this.$emit('reload');
      this.closeModal();

    },

    /**
     * Очищает данные.
     */
    clearCategoryData() {
      this.categoryEditor = {
        id: 0,
        slug: '',
        title: '',
        description: '',
      };
    },
  }
}
</script>

<style scoped>
/* Your styles here */
</style>
