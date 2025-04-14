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

  // async deleteLink(link) {
  //   const result =  await axios.post('links/delete-link', {
  //     link_id: link.id,
  //   });
  //   return result.data;
  // },


}
