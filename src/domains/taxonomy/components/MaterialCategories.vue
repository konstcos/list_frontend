<template>
  <div>
    <Dialog v-model:visible="modalOpen" modal header="Категории" :style="{ width: '40rem' }" @hide="closeModal">

      <h3 class="mb-3">{{ materialName }}</h3>

      <Divider />

      Тут будут категории и их привязка к конкретному материалу

<!--      <div v-if="modalOpen">-->
<!--        <div v-if="linkEditor" class="w-full px-2">-->
<!--          <Textarea-->
<!--            v-model="linkEditor.link"-->
<!--            rows="3"-->
<!--            required-->
<!--            placeholder="Link"-->
<!--            fluid />-->
<!--        </div>-->
<!--      </div>-->

      <div class="flex justify-end gap-2 mt-4">
        <Button type="button" label="Закрыть" size="small" severity="secondary" @click="closeModal"></Button>
<!--        <Button type="button" label="Сохранить" size="small" severity="success" @click="saveLink"></Button>-->
      </div>

    </Dialog>
  </div>
</template>

<script>
export default {
  name: "MaterialCategories",
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    categories: {
      type: Array,
      default: () => []
    },
    materialName: {
      type: String,
      default: null
    },
  },
  data() {
    return {
      modalOpen: this.value,
      currentCategories: [],

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
        this.currentCategories = this.categories;
      }
    }
  },
  methods: {
    openModal() {
      this.modalOpen = true;
      this.clearLinkData();
    },
    closeModal() {
      this.modalOpen = false;
      this.$emit('update:modelValue', false);
    },
    clearLinkData() {
      this.currentCategories = [];
    },
  },
}
</script>



<style scoped lang="scss">

</style>
