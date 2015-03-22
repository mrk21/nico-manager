class Api::MylistsController < ApplicationController
  before_action :require_authentication
  
  def index
    @mylists = @current_user.mylists
  end
  
  def entries
    @entries = @current_user.mylists.find_by(self.entries_params).entries
    render template: '/api/entries/index'
  end
  
  protected
  
  def entries_params
    {group_id: params.require(:group_id)}
  end
end
