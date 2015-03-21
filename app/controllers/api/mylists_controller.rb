class Api::MylistsController < ApplicationController
  before_action :require_authentication
  
  def index
    @mylists = @current_user.mylists
  end
end
