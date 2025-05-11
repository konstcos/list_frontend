<script setup>
import {onMounted, computed, ref} from "vue";
import TaxonomyCategoryUseCase from "../use_case/TaxonomyCategoryUseCase.js";

const taxonomyCategoryUseCase = new TaxonomyCategoryUseCase();

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['update:modelValue'])

let linksLoading = ref(false)
let categories = ref([])
let categoriesById = ref({})
// let selectedCategories = ref([])

const selectedCategories = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

async function receiveCategories() {
  categories.value = [];
  linksLoading.value = true;
  const allCategories = await taxonomyCategoryUseCase.receiveCategories();

  if (allCategories.status === 'success') {
    categories.value = [];
    categoriesById.value = {};

    for (let category of allCategories.data.categories) {
      categories.value.push(category);
      categoriesById[category.id] = category;
    }

  } else {
    alert('Ошибка при загрузке данных');
  }

  linksLoading.value = false;
}

function selectCategory(categoryId) {
  const current = selectedCategories.value

  if (current.includes(categoryId)) {
    selectedCategories.value = current.filter(item => item !== categoryId)
  } else {
    selectedCategories.value = [...current, categoryId]
  }

}

onMounted(() => {
  receiveCategories();
})


</script>

<template>
<div>
  <h2 class="mb-4">Категории</h2>
  <div v-if="linksLoading" class="mb-4">
    <ProgressBar color="info"
                 mode="indeterminate"
                 style="height: 4px;"
                 :pt="{ value: { style: { backgroundColor: '#38bdf9' } } }"
    ></ProgressBar>
  </div>
  <div v-if="!linksLoading && categories.length === 0" class="text-center mb-4">
    у вас пока нет категорий
  </div>

  <div>
    <PanelMenu :model="categories">
      <template #item="{ item }">
        <div
          v-ripple
          class="flex items-center cursor-pointer text-surface-700 dark:text-surface-0 px-4 py-2"
          @click="selectCategory(item.id)"
        >
          <span
            :class="selectedCategories.includes(item.id) ?  'pi pi-check' : ''"
            :style="selectedCategories.includes(item.id) ? 'color: green' : 'color: \'var(--p-primary-color)\''"
          />
          <span class="ml-2">{{ item.title }}</span>
<!--          <span class="pi pi-angle-down text-primary ml-auto" />-->
<!--          <span v-if="category.items" class="pi pi-angle-down text-primary ml-auto" />-->
        </div>
      </template>
    </PanelMenu>
  </div>

</div>
</template>

<style scoped lang="scss">

</style>
