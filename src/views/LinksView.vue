<template>
  <div>
    <h1>Каталог ссылок</h1>
    <div class="mt-4 ">

      <div class="flex flex-wrap -mx-2 mb-6">
        <div class="w-full md:w-1/2 px-2">
          <InputText
            v-model="newLink"
            type="text"
            required
            placeholder="link"
            fluid />
        </div>
        <div class="w-full md:w-1/2 px-2">
          <Button
            label="Сохранить"
            size="small"
            @click="saveLink()"
          />

          <Button
            label="Очистить"
            class="ml-2"
            size="small"
            severity="secondary"
            @click="newLink = null"
          />
        </div>
      </div>



      <div v-if="loading" class="mb-4">
        Загрузка...
      </div>

      <div>
        <div v-for="link in links" :key="link.id">
          <div class="flex flex-wrap mb-2">
            <div>
              <div class="link-id">
                {{ link.id }}
              </div>

              <a class="" :href="link.link" target="_blank">{{ link.link }}</a>

              <Button
                v-if="!loading"
                class="!px-2 !py-1 !text-xs !h-7 ml-3"
                @click="openLinkEditor(link)"
                :disabled="loading"
                icon="pi pi-pencil"
                severity="info"
                variant="text"
                rounded
              />

              <Button
                v-if="!loading"
                class="!px-2 !py-1 !text-xs !h-7"
                @click="openDeleteLinkModal(link)"
                :disabled="loading"
                icon="pi pi-times"
                severity="danger"
                variant="text"
                rounded
              />

            </div>
          </div>
        </div>
      </div>

    </div>

    <LinkEditor v-model="linkEditorModal.show" :link="linkEditorModal.link" @reload="loadLinks()"/>

    <Dialog v-model:visible="deleteLinkModal.show" modal header="Удаление линка" :style="{ width: '25rem' }">
      <span class="text-surface-500 dark:text-surface-400 block mb-8">Уверены что хотите удалить линк?</span>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Отмена" size="small" severity="secondary" @click="deleteLinkModal.show = false"></Button>
        <Button type="button" label="Удалить" size="small" severity="danger" @click="deleteLink"></Button>
      </div>
    </Dialog>
  </div>
</template>

<script>
import LinksUseCase from "../domains/links/use_case/LinksUseCase.js";
import LinkEditor from "../domains/links/components/LinkEditor.vue";
import LinkEntity from "../domains/links/entities/LinkEntity.js";

export default {
  name: "Links",
  components: {
    LinkEditor
  },
  setup() {
    const linksUseCase = new LinksUseCase();
    return { linksUseCase };
  },
  data() {
    return {
      links: [],
      loading: false,
      newLink: null,
      linkEditorModal: {
        show: false,
        link: {}
      },
      deleteLinkModal: {
        show: false,
        link: null
      },
    }
  },
  methods: {
    async saveLink() {
      if (this.newLink && this.newLink.trim().length === 0) {
        return false;
      }

      await this.linksUseCase.saveLink(new LinkEntity({
        id: 0,
        link: this.newLink
      }));
      this.newLink = null;

      this.loadLinks();
    },
    openLinkEditor(link = null) {
      this.linkEditorModal.link = link || new LinkEntity();

      this.linkEditorModal.show = true;
    },
    async loadLinks() {
      this.loading = true;
      this.links = await this.linksUseCase.getUserLinks();
      this.loading = false;
    },
    openDeleteLinkModal(link) {
      this.deleteLinkModal.link = link;
      this.deleteLinkModal.show = true;
    },
    async deleteLink() {
      if (this.deleteLinkModal && !this.deleteLinkModal.link) {
        return false;
      }

      await this.linksUseCase.deleteLink(this.deleteLinkModal.link);
      this.deleteLinkModal.show = false;
      this.loadLinks();
    },
  },
  mounted() {
    this.loadLinks();
  }
}
</script>


<style scoped lang="scss">

.link-id {
  width: 30px;
  display: inline-block;
}

</style>
