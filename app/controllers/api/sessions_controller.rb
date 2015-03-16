class Api::SessionsController < ApplicationController
  before_action :require_authentication, only: :show
  
  def show
  end
  
  def create
    if @current_user = User.authenticate(self.auth_params) then
      session[:user_id] = @current_user.id
      render action: :show
    else
      session[:user_id] = nil
      render action: :create_error, status: 401
    end
  end
  
  def destroy
    session[:user_id] = nil
  end
  
  protected
  
  def auth_params
    params.require(:auth).permit(:mail, :password)
  end
end
