import IDBHandler from '../IDBHandler.js'
import CategoryRepository from '../Repositories/CategoryRepository.js'
import FeedItemRepository from '../Repositories/FeedItemRepository.js'
import FeedRepository from '../Repositories/FeedRepository.js'
import FeedService from './FeedService.js'

class FeedServiceFactory {
    static build () {
        return new FeedService(
            new FeedRepository(new IDBHandler(indexedDB)),
            new CategoryRepository(new IDBHandler(indexedDB)),
            new FeedItemRepository(new IDBHandler(indexedDB))
        )
    }
}

export default FeedServiceFactory
