import { ElasticSearchRequestBuilder } from './elastic_search_request_builder'

export class MegamenuESRequestBuilder extends ElasticSearchRequestBuilder {
  public constructor () {
    super('megamenu')
  }
}
