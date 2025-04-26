<template>
  <div>
    <h1>Каталог ссылок</h1>

    <div class="flex flex-1 overflow-hidden mt-4">

      <aside class="w-64 overflow-y-auto">
        тут пока пусто потому что нет ни одной категории
      </aside>

      <div class="flex-1 ml-4 mr-4 overflow-y-auto">
        <div class="mb-4">
          <div class="flex flex-wrap -mx-2">
            <div class="w-full md:w-2/3 px-2">
              <InputText
                v-model="newLink"
                type="text"
                required
                placeholder="link"
                fluid />
            </div>
            <div class="w-full md:w-1/3 px-2">
              <Button
                label="Сохранить"
                size="small"
                :loading="loading"
                @click="saveLink()"
              />

              <Button
                label="Очистить"
                class="ml-2"
                size="small"
                severity="secondary"
                @click="clearNewLink()"
              />
            </div>
          </div>

          <div v-if="errorType === 'wrong_url_format'" class="wrong-url-format mt-2 ml-1 mb-4">
            не правильный формат линка
          </div>

          <div v-if="errorType === 'unknown_error'" class="wrong-url-format mt-2 ml-1 mb-4">
            не известная ошибка при сохранении, попробуйте позже
          </div>

          <div v-if="errorType === 'link_already_exists'" class="wrong-url-format mt-2 ml-1 mb-4">
            Точно такой же линк уже существует в системе
          </div>
        </div>

        <div v-if="loading" class="mb-4">
          Загрузка...
        </div>

        <div>

          <div v-for="link in links" :key="link.id">
            <div class="flex flex-wrap mb-2">
              <Card class="w-full relative ">


                <template #content>
                  <div class="absolute top-2 right-2 flex space-x-0">
                    <Button
                            v-if="!loading"
                            class="!text-xs"
                            @click="openLinkEditor(link)"
                            :disabled="loading"
                            icon="pi pi-pencil"
                            severity="info"
                            variant="text"
                            rounded
                    />
                    <Button
                            v-if="!loading"
                            class="!text-xs"
                            @click="openDeleteLinkModal(link)"
                            :disabled="loading"
                            icon="pi pi-trash"
                            severity="danger"
                            variant="text"
                            rounded
                    />
                  </div>
                  <div class="absolute bottom-2 right-5 flex space-x-0">
                    <span class="link-id text-gray-900 dark:text-gray-600 text-xs">
                        # {{ link.id }}
                      </span>
                  </div>

                  <div>
                    <div class="mb-2">
                      <div class="flex text-gray-900 dark:text-gray-500 text-xs">


                        <div
                          v-if="link.categories.length === 0"
                          @click="openCategoriesEditor(link)"
                          class="bg-gray-900 dark:bg-zinc-950 pl-2 pr-2 py-0 rounded-2xl cursor-pointer"
                        >
                          пусто
                        </div>

                        <template v-for="(category, key) in link.categories" :key="category.id">

                          <span v-if="key > 0" class="text-gray-900 dark:text-gray-200 text-xs mx-1">•</span>

                          <div
                            @click="openCategoriesEditor(link)"
                            class="bg-gray-900 dark:bg-zinc-950 pl-2 pr-2 py-0 rounded-2xl cursor-pointer"
                          >
                            {{ category.title }}
                          </div>

                        </template>

<!--                        <span class="text-gray-900 dark:text-gray-200 text-xs mx-1">•</span>-->

<!--                        <div-->
<!--                          @click="openCategoriesEditor(link)"-->
<!--                          class="bg-gray-900 dark:bg-zinc-950 pl-2 pr-2 py-0 rounded-2xl cursor-pointer"-->
<!--                        >-->
<!--                          AI / Stable Diffusion-->
<!--                        </div>-->

<!--                        <span class="text-gray-900 dark:text-gray-200 text-xs mx-1">•</span>-->

<!--                        <div-->
<!--                          @click="openCategoriesEditor(link)"-->
<!--                          class="bg-gray-900 dark:bg-zinc-950 pl-2 pr-2 py-0 rounded-2xl cursor-pointer"-->
<!--                        >-->
<!--                          Design / Gimp-->
<!--                        </div>-->

                      </div>
                    </div>


                    <a class="" :href="link.link" target="_blank">{{ link.link }}</a>


                    <div class="flex flex-wrap gap-2 mt-3">
                      <Tag value="Primary" class="!text-[10px]"></Tag>
                      <Tag severity="secondary" value="Secondary" class="!text-[10px]"></Tag>
                      <Tag severity="success" value="Success" class="!text-[10px]"></Tag>
                      <Tag severity="info" value="Info" class="!text-[10px]"></Tag>
                      <Tag severity="warn" value="Warn" class="!text-[10px]"></Tag>
                      <Tag severity="danger" value="Danger" class="!text-[10px]"></Tag>
                      <Tag severity="contrast" value="Contrast" class="!text-[10px]"></Tag>
                    </div>

                  </div>
                </template>
              </Card>

            </div>
          </div>
        </div>

        <div v-if="!loading && links.length === 0" class="mb-4">
          Ссылок пока нет
        </div>
      </div>

      <aside class="w-64 overflow-y-auto">
        Нет ни одного тега
      </aside>
    </div>

    <LinkEditor v-model="linkEditorModal.show" :link="linkEditorModal.link" @reload="loadLinks()"/>
    <MaterialCategories
      v-model="categoriesEditorModal.show"
      material-module="links"
      :material-id="categoriesEditorModal.materialId"
      :material-name="categoriesEditorModal.materialName"
      :primary-category-id="categoriesEditorModal.primaryCategoryId"
      :first-category-id="categoriesEditorModal.firstCategoryId"
      :second-category-id="categoriesEditorModal.secondCategoryId"
      :third-category-id="categoriesEditorModal.thirdCategoryId"
      @reload="loadLinks()"
    />

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
import MaterialCategories from "../domains/taxonomy/components/MaterialCategories.vue";

export default {
  name: "Links",
  components: {
    LinkEditor,
    MaterialCategories,
  },
  setup() {
    const linksUseCase = new LinksUseCase();
    return { linksUseCase };
  },
  data() {
    return {
      links: [],
      loading: false,
      errorType: null,
      newLink: null,
      linkEditorModal: {
        show: false,
        link: {},
      },
      categoriesEditorModal: {
        show: false,
        materialId: null,
        primaryCategoryId: null,
        firstCategoryId: null,
        secondCategoryId: null,
        thirdCategoryId: null,
        materialName: null,
      },
      deleteLinkModal: {
        show: false,
        link: null
      },
    }
  },
  methods: {

    clearNewLink() {
      this.newLink = null;
      this.errorType = null;
    },

    async saveLink() {
      if (this.newLink && this.newLink.trim().length === 0) {
        return false;
      }

      this.errorType = null;
      this.loading = true;

      const result = await this.linksUseCase.saveLink(new LinkEntity({
        id: 0,
        link: this.newLink
      }));

      this.loading = false;

      if (result.status === 'fail') {



        if (result.info === 'wrong_url_format') {
          this.errorType = 'wrong_url_format';
        } else if(result.info === 'link_already_exists') {
          this.errorType = 'link_already_exists';
        } else {
          this.errorType = 'unknown_error';
        }

        return false;
      }

      this.newLink = null;

      this.loadLinks();
    },

    openLinkEditor(link = null) {
      this.linkEditorModal.link = link || new LinkEntity();

      this.linkEditorModal.show = true;
    },

    openCategoriesEditor(link) {

      this.categoriesEditorModal.materialId = link.id;
      this.categoriesEditorModal.materialName = link.link;

      this.categoriesEditorModal.primaryCategoryId = null;
      this.categoriesEditorModal.firstCategoryId = null;
      this.categoriesEditorModal.secondCategoryId = null;
      this.categoriesEditorModal.thirdCategoryId = null;

        let i = 0;
      for (let category of link.categories) {
        if (category.is_primary) {
          this.categoriesEditorModal.primaryCategoryId = category.id;
        }

        if (i === 0) {
          this.categoriesEditorModal.firstCategoryId = category.id;
        } else if (i === 1) {
          this.categoriesEditorModal.secondCategoryId = category.id;
        } else if (i === 2) {
          this.categoriesEditorModal.thirdCategoryId = category.id;
        }

        i++;
      }

      this.categoriesEditorModal.show = true;
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

//.link-id {
//  width: 40px;
//}

.wrong-url-format {
  color: #ff8c8c;
}

</style>
