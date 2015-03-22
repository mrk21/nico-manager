class Api::TagsController < ApplicationController
  before_action :require_authentication
  
  def index
    @tags = @current_user.tags.order('taggings_count desc')
  end
  
  def entries
    @entries = @current_user.entries.tagged_with(self.entries_params)
    render template: '/api/entries/index'
  end
  
  protected
  
  def entries_params
    params.require(:name)
  end
end
