import axios from '../utils/axios.js'
import WalletEntity from '../domains/wallets/entities/WalletEntity.js';

export default {

  async getUseLinks(page, categories) {
    const result =  await axios.post('links/user-links', {
      page: page,
      categories: categories,
    });
    return result.data;
  },

  async saveLink(link) {
    const result =  await axios.post('links/save-link', {
      id: link.id,
      link: link.link,
    });
    return result.data;
  },

  async deleteLink(link) {
    const result =  await axios.post('links/delete-link', {
      link_id: link.id,
    });
    return result.data;
  },


}
