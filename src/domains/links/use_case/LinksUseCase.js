import LinksRepository from "../repositories/LinksRepository.js";
import LinkEntity from "../entities/LinkEntity.js";

export default class LinksUseCase {

    constructor() {
        this.linksRepository = new LinksRepository();
    }

    async getUserLinks(page, categories) {
        try {
            const result = await this.linksRepository.getUserLinks(page, categories);
            if (result['status'] === 'success') {
                let links = [];
                for(let link of result['data']['links']) {
                    links.push(new LinkEntity({
                        id: link.id,
                        link: link.link,
                        categories: link.categories,
                    }));
                }

                return links;
            }

            return [];
        } catch (error) {
            return false;
        }
    }


    async saveLink(link) {
        try {
            return await this.linksRepository.saveLink(link);
        } catch (error) {
            return false;
        }
    }


    async deleteLink(link) {
        try {
            return await this.linksRepository.deleteLink(link);
        } catch (error) {
            return false;
        }
    }



}
