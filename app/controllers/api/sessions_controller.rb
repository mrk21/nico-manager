class Api::SessionsController < ApplicationController
  before_action :require_login, only: :show
  
  def show
  end
  
  def create
    auth = self.auth_params
    if user = User.authorize(auth[:mail], auth[:password]) then
      session[:user_id] = user.id
      render action: :show
    else
      session[:user_id] = nil
      render nothing: true, status: 400
    end
  end
  
  def destroy
    session[:user_id] = nil
    render nothing: true
  end
  
  protected
  
  def auth_params
    params.require(:auth).permit(:mail, :password)
  end
end
