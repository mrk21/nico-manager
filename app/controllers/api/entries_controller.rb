class Api::EntriesController < ApplicationController
  before_action :require_authentication
  
  def index
    @entries = @current_user.entries
  end
end
