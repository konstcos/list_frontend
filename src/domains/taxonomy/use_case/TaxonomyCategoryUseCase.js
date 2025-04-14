import TaxonomyCategoryRepository from "../repositories/TaxonomyCategoryRepository.js";
// import LinkEntity from "../entities/LinkEntity.js";

export default class TaxonomyCategoryUseCase {

    constructor() {
        this.taxonomyCategoryRepository = new TaxonomyCategoryRepository();
    }

    async getUserCategories() {
        try {
            const result = await this.taxonomyCategoryRepository.getUserCategories();

            if (result['status'] === 'success') {
                let categories = [];
                for(let category of result['data']['categories']) {
                    // links.push(new LinkEntity({
                    //     id: link.id,
                    //     link: link.link,
                    // }));
                    categories.push(category);
                }

                return categories;
            }

            return [];
        } catch (error) {
            return false;
        }
    }


    async saveCategory(category) {
        try {
            return await this.taxonomyCategoryRepository .saveCategory(category);
        } catch (error) {
            return false;
        }
    }


    async deleteLink(link) {
        // try {
        //     return await this.linksRepository.deleteLink(link);
        // } catch (error) {
        //     return false;
        // }
    }



}
