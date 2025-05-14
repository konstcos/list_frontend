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










  async getUseTags() {
    const result =  await axios.post('taxonomy/tags/user-tags', {});
    return result.data;
  },

  async saveTag(tag) {
    const result =  await axios.post('taxonomy/tags/save-tag', {
      id: tag.id,
      slug: tag.slug,
      title: tag.title,
      description: tag.description,
      color: tag.color,
    });
    return result.data;
  },

  async deleteTag(tagId) {
    const result =  await axios.post('taxonomy/tags/delete-tag', {
      tag_id: tagId
    });
    return result.data;
  },

  async bindTag(data) {
    const result =  await axios.post('taxonomy/tags/bind-material', {
      material_id: data.materialId,
      tag_id: data.category1Id,
    });
    return result.data;
  },

  async receiveTags() {
    const result =  await axios.post('taxonomy/tags/receive-tag', {});
    return result.data;
  },





}
