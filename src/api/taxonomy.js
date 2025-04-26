import axios from '../utils/axios.js'

export default {

  async getUseCategories() {
    const result =  await axios.post('taxonomy/categories/user-categories', {});
    return result.data;
  },

  async saveCategory(category) {
    const result =  await axios.post('taxonomy/categories/save-category', {
      id: category.id,
      slug: category.slug,
      title: category.title,
      description: category.description,
    });
    return result.data;
  },

  async deleteCategory(categoryId) {
    const result =  await axios.post('taxonomy/categories/delete-category', {
      category_id: categoryId
    });
    return result.data;
  },

  async bindMaterial(data) {
    const result =  await axios.post('taxonomy/categories/bind-material', {
      material_id: data.materialId,
      primary_id: data.primaryCategoryId,
      category1_id: data.category1Id,
      category2_id: data.category2Id,
      category3_id: data.category3Id,
    });
    return result.data;
  },

  async receiveCategories() {
    const result =  await axios.post('taxonomy/categories/receive-category', {});
    return result.data;
  },


}
