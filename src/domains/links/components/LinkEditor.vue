<template>
  <div>
    <Dialog v-model:visible="modalOpen" modal header="Линк" :style="{ width: '25rem' }" @hide="closeModal">

      <div v-if="modalOpen">
        <div v-if="linkEditor" class="w-full px-2">
          <Textarea
            v-model="linkEditor.link"
            rows="3"
            required
            placeholder="Link"
            fluid />
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <Button type="button" label="Закрыть" size="small" severity="secondary" @click="closeModal"></Button>
        <Button type="button" label="Сохранить" size="small" severity="success" @click="saveLink"></Button>
      </div>

    </Dialog>
  </div>
</template>

<script>
import LinkRepository from "../repositories/LinksRepository.js";
import LinkUseCase from "../use_case/LinksUseCase.js";
import LinkEntity from "../entities/LinkEntity.js";


export default {
  name: 'LinkEditor',
  setup() {
    const linkRepository = new LinkRepository();
    const linkUseCase = new LinkUseCase();
    return {linkRepository, linkUseCase};
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    link: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      modalOpen: this.value,
      linkEditor: {
        id: 0,
        link: ''
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
        this.linkEditor.id = this.link.id;
        this.linkEditor.link = this.link.link;
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

    /**
     * Сохранение
     */
    async saveLink() {
      // console.log('saveLink');
      this.loading = true;
      const result = await this.linkRepository.saveLink(new LinkEntity({
        id: this.linkEditor.id,
        link: this.linkEditor.link
      }));
      this.loading = false;
      this.$emit('reload');
      this.closeModal();

    },

    /**
     * Очищает данные
     */
    clearLinkData() {
      this.linkEditor = {
        id: 0,
        link: ''
      };
    },
  }
}
</script>

<style scoped>
/* Your styles here */
</style>
