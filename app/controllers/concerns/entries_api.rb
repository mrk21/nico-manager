module EntriesAPI
  extend ActiveSupport::Concern
  
  def entries_api_index(scope)
    @entries = scope
      .includes(:video, :mylist)
      .search(params[:q])
    render template: '/api/entries/index'
  end
end
