class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  
  protected
  
  def require_authentication
    if session[:user_id].present? then
      @current_user = User.find session[:user_id]
    else
      render action: :require_authentication_error, status: 400
    end
  end
end
