class Api::MylistsController < ApplicationController
  include EntriesAPI
  
  before_action :require_authentication
  
  def index
    @mylists = @current_user.mylists.without_deflist
  end
  
  def entries
    self.entries_api_index(@current_user.mylists
      .find_by(self.entries_params)
      .entries
    )
  end
  
  protected
  
  def entries_params
    {group_id: params.require(:group_id)}
  end
end
