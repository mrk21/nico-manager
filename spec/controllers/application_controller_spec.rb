require 'rails_helper'

RSpec.describe ApplicationController, type: :controller do
  describe '#logged_in?()' do
    let(:user){ FactoryGirl.create :user }
    
    controller do
      before_action :require_login
      
      def index
        render text: 'ok', status: 200
      end
    end
    
    before do
      session[:user_id] = self.user.id
      get :index
    end
    
    it 'should return a response set by the action' do
      expect(response.body).to eq 'ok'
    end
    
    it 'should set current user' do
      expect(assigns(:current_user)).to eq self.user
    end
    
    context 'when not logged in' do
      let(:user){ FactoryGirl.build :user }
      
      it 'should return an error response' do
        expect(response).to have_http_status(400)
      end
      
      it 'should not set current user' do
        expect(assigns(:current_user)).to be_nil
      end
    end
  end
end
