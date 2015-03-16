class ApplicationController < ActionController::Base
  protected
  
  def require_authentication
    if session[:user_id].present? then
      @current_user = User.find session[:user_id]
    else
      render action: :require_authentication_error, status: 401
    end
  end
end
