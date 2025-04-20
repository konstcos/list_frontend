<template>
  <div>
    <h1>
      Категории
      <Button
        variant="text"
        icon="pi pi-plus"
        rounded
        severity="info"
        :loading="loading"
        size="small"
        @click="openCategoryEditor()"
      />
      <Button
        variant="text"
        icon="pi pi-refresh"
        rounded
        severity="info"
        :loading="loading"
        size="small"
        @click="loadCategories()"
      />
    </h1>

    <div v-if="loading" class="mt-3">
      <ProgressBar color="info"
                   mode="indeterminate"
                   style="height: 4px;"
                   :pt="{ value: { style: { backgroundColor: '#38bdf9' } } }"
      ></ProgressBar>
    </div>

    <div class="mt-4">
      <div v-for="category in categories" :key="category.id" class="flex flex-wrap mb-2">
        <div class="w-full md:w-1/2 px-2">
          <div class="">
            <Card>
              <template #content>
                <div class="flex justify-content-between align-items-center pb-3 surface-card shadow-1 border-round mb-2">

                  <div class="flex-1">
                    {{ category.title }}
                  </div>

                  <i class="cursor-pointer pi pi-ellipsis-v ml-2 mt-2" @click="openMenu($event, category)"></i>



                </div>
              </template>
            </Card>

          </div>



<!--          <a class="" :href="category.link" target="_blank">{{ category.link }}</a>-->

<!--          <Button-->
<!--            v-if="!loading"-->
<!--            class="!px-2 !py-1 !text-xs !h-7 ml-3"-->
<!--            @click="openCategoryEditor(category)"-->
<!--            :disabled="loading"-->
<!--            icon="pi pi-pencil"-->
<!--            severity="info"-->
<!--            variant="text"-->
<!--            rounded-->
<!--          />-->

<!--          <Button-->
<!--            v-if="!loading"-->
<!--            class="!px-2 !py-1 !text-xs !h-7 ml-3"-->
<!--            @click="deleteLink(link)"-->
<!--            :disabled="loading"-->
<!--            icon="pi pi-trash"-->
<!--            severity="danger"-->
<!--            variant="text"-->
<!--            rounded-->
<!--          />-->
        </div>

      </div>

    </div>

    <div v-if="!loading && categories.length === 0" class="mb-4">
      Категорий пока нет
    </div>

    <Popover ref="menu_popover">
      <div style="display: flex; flex-direction: column; gap: 8px; width: 150px">
        <Button
          label="Редактировать"
          icon="pi pi-pencil"
          @click="editActiveCategory"
          style="width: 100%; justify-content: flex-start"
          class="p-button-text"
          size="small"
        />
        <Button
          label="Удалить"
          icon="pi pi-trash"
          @click="deleteActiveCategory"
          style="width: 100%; justify-content: flex-start"
          class="p-button-text p-button-danger"
          size="small"
        />
      </div>
    </Popover>

    <TaxonomyCategoryEditor v-model="categoryEditorModal.show" :category="categoryEditorModal.category" @reload="loadCategories()" />
  </div>

</template>

<script>
import TaxonomyCategoryUseCase from "../use_case/TaxonomyCategoryUseCase.js";
import TaxonomyCategoryEditor from "../components/TaxonomyCategoryEditor.vue";
// import LinkEditor from "~/src/domains/links/components/LinkEditor.vue";
// import LinkEntity from "~/src/domains/links/entities/LinkEntity.js";
export default {
  name: "TaxonomyCategoriesView",
  setup() {
    const taxonomyCategoryUseCase = new TaxonomyCategoryUseCase();
    return {taxonomyCategoryUseCase };
  },
  data() {
    return {
      categories: [],
      loading: false,
      categoryEditorModal: {
        show: false,
        category: {}
      },
      activeCategory: null,
      deleteCategoryModal: {
        show: false,
        categoryId: 0,
        loading: false,
      },
    };
  },
  components: {
    TaxonomyCategoryEditor,
  },
  methods: {
    openMenu(event, category) {
      this.activeCategory = category;
      this.$refs.menu_popover.toggle(event);
    },
    editActiveCategory() {
      if (this.activeCategory) {
        this.openCategoryEditor(this.activeCategory);
        this.$refs.menu_popover.hide();
      }
    },
    deleteActiveCategory() {
      if (this.activeCategory) {
        this.deleteCategory(this.activeCategory);
        this.$refs.menu_popover.hide();
      }
    },

    async loadCategories() {
      this.loading = true;
      const result = await this.taxonomyCategoryUseCase.getUserCategories();

      if (result === false) {
        alert("Ошибка при загрузке данных");
      } else {
        this.categories = result;
      }

      this.loading = false;
    },
    openCategoryEditor(category = null) {
      this.categoryEditorModal.category = {
        id: 0,
        slug: '',
        title: '',
        description: '',
      };

      if (category) {
        this.categoryEditorModal.category = category;
      }

      this.categoryEditorModal.show = true;
    },
    deleteCategory(category) {
      this.deleteCategoryModal.categoryId = category.id;


      this.$confirm.require({
        message: 'Подтвердите удаление категории',
        header: 'Подтверждение удаления',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Да',
        rejectLabel: 'Отмена',
        accept: () => {
          this.makeDeleteCategory();
        },
        reject: () => {},
        acceptClass: 'p-button-text p-button-danger p-button-sm',
        rejectClass: 'p-button-text p-button-secondary p-button-sm'
      });
    },
    async makeDeleteCategory() {
      this.deleteCategoryModal.loading = true;

      const result = await this.taxonomyCategoryUseCase.deleteCategory(this.deleteCategoryModal.categoryId);

      if (result === false) {
        alert("Ошибка при удалении категории");
      } else {
        this.loadCategories();
      }

      this.deleteCategoryModal.loading = false;
      this.deleteCategoryModal.show = false;
    }
  },
  mounted() {
    this.loadCategories();
  },
}
</script>

<style scoped lang="scss">

</style>
