class Api::EntriesController < ApplicationController
  before_action :require_authentication
  
  def index
    @entries = @current_user.mylists.find_by(group_id: nil).entries
  end
end
