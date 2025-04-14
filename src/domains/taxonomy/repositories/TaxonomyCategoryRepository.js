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

  async deleteLink(link) {
    // try {
    //   return await linksApi.deleteLink(link);
    // } catch (error) {
    //   return false;
    // }
  }

}
