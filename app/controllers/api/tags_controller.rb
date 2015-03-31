class Api::TagsController < ApplicationController
  include EntriesAPI
  
  before_action :require_authentication
  
  def index
    @tags = @current_user.tags.order('taggings_count desc')
  end
  
  def entries
    self.entries_api_index(@current_user.entries
      .tagged_with(self.entries_params)
    )
  end
  
  protected
  
  def entries_params
    params.require(:name)
  end
end
