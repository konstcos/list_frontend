<template>
  <div>
    <Dialog v-model:visible="modalOpen" modal header="Категории" :style="{ width: '40rem' }" @hide="closeModal">

      <div class="mb-3 bold">{{ materialName }}</div>

      <div v-if="loading" class="mt-3">
        <ProgressBar color="info"
                     mode="indeterminate"
                     style="height: 4px;"
                     :pt="{ value: { style: { backgroundColor: '#38bdf9' } } }"
        ></ProgressBar>
      </div>


      <div v-if="modalOpen">
        <div v-if="!loading && systemCategories && systemCategories.length > 0" class="w-full px-2">

          <div>

            <Divider />

            <Select
                  v-model="categoryFirstId"
                  :options="categoriesListForFirst"
                  filter
                  option-value="id"
                  optionLabel="title"
                  size="small"
                  placeholder="-"
                  class="w-full md:w-56"
                >
                  <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex items-center">
                      <div>{{ categoriesById[slotProps.value] ? categoriesById[slotProps.value].title : 'error' }}</div>
                    </div>
                    <span v-else>
                      {{ slotProps.placeholder }}
                    </span>
                  </template>
                  <template #option="slotProps">
                    <div class="flex items-center">
                      <div>{{ slotProps.option.title }}</div>
                    </div>
                  </template>
                </Select>
            <Button label="Очистить" size="small" class="ml-3" @click="clearCategory('first')" />

            <Divider />

            <Select
              v-model="categorySecondId"
              :options="categoriesListForSecond"
              filter
              option-value="id"
              optionLabel="title"
              size="small"
              placeholder="-"
              class="w-full md:w-56"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex items-center">
                  <div>{{ categoriesById[slotProps.value] ? categoriesById[slotProps.value].title : 'error' }}</div>
                </div>
                <span v-else>
                      {{ slotProps.placeholder }}
                    </span>
              </template>
              <template #option="slotProps">
                <div class="flex items-center">
                  <div>{{ slotProps.option.title }}</div>
                </div>
              </template>
            </Select>
            <Button label="Очистить" size="small" class="ml-3" @click="clearCategory('second')" />

            <Divider />

            <Select
              v-model="categoryThirdId"
              :options="categoriesListForThird"
              filter
              option-value="id"
              optionLabel="title"
              size="small"
              placeholder="-"
              class="w-full md:w-56"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex items-center">
                  <div>{{ categoriesById[slotProps.value] ? categoriesById[slotProps.value].title : 'error' }}</div>
                </div>
                <span v-else>
                      {{ slotProps.placeholder }}
                    </span>
              </template>
              <template #option="slotProps">
                <div class="flex items-center">
                  <div>{{ slotProps.option.title }}</div>
                </div>
              </template>
            </Select>
            <Button label="Очистить" size="small" class="ml-3" @click="clearCategory('third')" />

            <Divider />
          </div>

        </div>
      </div>



      <div class="flex justify-end gap-2 mt-4">
        <Button type="button" label="Закрыть" size="small" severity="secondary" @click="closeModal"></Button>
        <Button type="button" label="Сохранить" size="small" severity="success" :loading="saveLoading" @click="saveCategories"></Button>
      </div>

    </Dialog>
  </div>
</template>

<script>
import TaxonomyCategoryUseCase from "../use_case/TaxonomyCategoryUseCase.js";

export default {
  name: "MaterialCategories",
  setup() {
    const taxonomyCategoryUseCase = new TaxonomyCategoryUseCase();
    return {taxonomyCategoryUseCase };
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    materialId: {
      type: Number,
    },
    materialName: {
      type: String,
    },
    materialModule: {
      type: String,
    },
    primaryCategoryId: {
      type: Number,
      nullable: true,
      default: () => null
    },
    firstCategoryId: {
      type: Number,
      nullable: true,
      default: () => null
    },
    secondCategoryId: {
      type: Number,
      nullable: true,
      default: () => null
    },
    thirdCategoryId: {
      type: Number,
      nullable: true,
      default: () => null
    },
  },
  data() {
    return {
      modalOpen: this.value,
      currentCategories: [],
      systemCategories: [],
      categoriesById: {},
      loading: false,

      categoryPrimaryId: 0,
      categoryFirstId: 0,
      categorySecondId: 0,
      categoryThirdId: 0,

      saveLoading: false,
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

        this.categoryPrimaryId = this.primaryCategoryId ? parseInt(this.primaryCategoryId) : 0;
        this.categoryFirstId = this.firstCategoryId ? parseInt(this.firstCategoryId) : 0;
        this.categorySecondId = this.secondCategoryId ? parseInt(this.secondCategoryId) : 0;
        this.categoryThirdId = this.thirdCategoryId ? parseInt(this.thirdCategoryId) : 0;
      }
    },
  },
  computed: {
    categoriesListForFirst() {
      return this.systemCategories.filter((item) => {
        return item.id !== this.categorySecondId && item.id !== this.categoryThirdId;
      });
    },

    categoriesListForSecond() {
      return this.systemCategories.filter((item) => {
        return item.id !== this.categoryFirstId && item.id !== this.categoryThirdId;
      });
    },

    categoriesListForThird() {
      return this.systemCategories.filter((item) => {
        return item.id !== this.categorySecondId && item.id !== this.categoryFirstId;
      });
    },
  },
  methods: {
    async openModal() {
      this.modalOpen = true;
      this.saveLoading = false;
      this.receiveCategories();
    },
    async receiveCategories() {
      this.systemCategories = [];
      this.loading = true;
      const result = await this.taxonomyCategoryUseCase.receiveCategories();
      this.loading = false;
      if (result.status === 'success') {
        this.systemCategories = [];
        this.categoriesById = {};

        for (let category of result.data.categories) {
          this.systemCategories.push(category);
          this.categoriesById[category.id] = category;
        }

      } else {
        alert('Ошибка при загрузке данных');
      }
    },
    closeModal() {
      this.modalOpen = false;
      this.$emit('update:modelValue', false);
      this.clearData();
    },
    clearData() {
      this.currentCategories = [];
      this.systemCategories = [];
    },
    clearCategory(type) {

      if (type === 'first') {
        this.categoryFirstId = 0;
      } else if (type === 'second') {
        this.categorySecondId = 0;
      } else if (type === 'third') {
        this.categoryThirdId = 0;
      }
    },

    async saveCategories() {
      this.saveLoading = true;
      const result = await this.taxonomyCategoryUseCase.bindMaterial({
        materialId: this.materialId,
        module: this.materialModule,
        primaryCategoryId: this.categoryPrimaryId ?? 0,
        category1Id: this.categoryFirstId ?? 0,
        category2Id: this.categorySecondId ?? 0,
        category3Id: this.categoryThirdId ?? 0,
      });
      this.loading = false;
      if (result.status === 'success') {
        this.$emit('reload');
        this.closeModal();
      } else {
        alert('Ошибка при coхранении данных');
      }
    }
  },
  mounted() {

  },
}
</script>



<style scoped lang="scss">

.category-label {
  font-size: 11px;
}

</style>
