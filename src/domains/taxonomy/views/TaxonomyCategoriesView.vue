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
    </h1>

    <div class="mt-4">
      <div v-for="category in categories" :key="category.id" class="flex flex-wrap mb-2">
        <div class="w-full md:w-1/2 px-2">
          <div class="">
            {{ category.title }}
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
    };
  },
  components: {
    TaxonomyCategoryEditor,
  },
  methods: {
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
  },
  mounted() {
    this.loadCategories();
  },
}
</script>

<style scoped lang="scss">

</style>
