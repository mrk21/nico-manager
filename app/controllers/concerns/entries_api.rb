module EntriesAPI
  extend ActiveSupport::Concern
  
  def entries_api_index(scope)
    @entries = scope
      .includes(:video, :mylist)
      .search(params[:q])
    
    count = @entries.count
    
    if matches = request.headers['Range'].to_s.match(/records=(\d+)-(\d+)/) then
      @entries = @entries.offset(matches[1].to_i).limit(matches[2].to_i - matches[1].to_i)
      since = matches[1].to_i
      until_ = since + @entries.count
      response.status = 206
      response.headers['Accept-Ranges'] = 'records'
      response.headers['Content-Range'] = "records #{since}-#{until_}/#{count}"
    end
    
    render template: '/api/entries/index'
  end
end
