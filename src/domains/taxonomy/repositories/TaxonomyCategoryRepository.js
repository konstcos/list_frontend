import taxonomyApi from '../../../api/taxonomy.js';


export default class TaxonomyCategoryRepository {
  async getUserCategories() {
    try {
      return await taxonomyApi.getUseCategories();
    } catch (error) {
      return false;
    }
  }

  async saveCategory(category) {
    try {
      return await taxonomyApi.saveCategory(category);
    } catch (error) {
      return false;
    }
  }

  async deleteCategory(categoryId) {
    try {
      return await taxonomyApi.deleteCategory(categoryId);
    } catch (error) {
      return false;
    }
  }

}
