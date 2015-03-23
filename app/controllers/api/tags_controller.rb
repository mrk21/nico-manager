class Api::TagsController < ApplicationController
  before_action :require_authentication
  
  def index
    @tags = @current_user.tags.order('taggings_count desc')
  end
  
  def entries
    @entries = @current_user.entries
      .includes(:video, :mylist)
      .tagged_with(self.entries_params)
      .search(params[:q])
    render template: '/api/entries/index'
  end
  
  protected
  
  def entries_params
    params.require(:name)
  end
end
