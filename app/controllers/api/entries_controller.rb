class Api::EntriesController < ApplicationController
  include EntriesAPI
  
  before_action :require_authentication
  
  def index
    self.entries_api_index(@current_user.entries)
  end
end
