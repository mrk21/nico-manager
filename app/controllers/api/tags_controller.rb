class Api::TagsController < ApplicationController
  before_action :require_authentication
  
  def index
    @tags = @current_user.tags.order('taggings_count desc')
  end
end
