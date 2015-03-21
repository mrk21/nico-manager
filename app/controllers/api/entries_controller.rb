class Api::EntriesController < ApplicationController
  before_action :require_authentication
  
  def index
    if params[:group_id].nil? then
      @entries = @current_user.entries
    else
      @entries = @current_user.mylists.find_by(group_id: params[:group_id]).entries
    end
  end
end
