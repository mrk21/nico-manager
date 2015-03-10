require 'rails_helper'

RSpec.describe ApplicationController, type: :controller do
  describe '#require_authentication()' do
    let(:user){ FactoryGirl.create :user }
    
    controller do
      before_action :require_authentication
      
      def index
        render text: 'ok', status: 200
      end
    end
    
    before do
      session[:user_id] = self.user.id
      subject
    end
    
    subject { get :index, format: 'json' }
    
    it 'should return a response set by the action' do
      is_expected.to have_http_status 200
    end
    
    it 'should set current user' do
      expect(assigns(:current_user)).to eq self.user
    end
    
    context 'when not logged in' do
      let(:user){ FactoryGirl.build :user }
      
      it { is_expected.to have_http_status 400 }
      it { is_expected.to render_template :require_authentication_error }
      
      it 'should not set current user' do
        expect(assigns(:current_user)).to be_nil
      end
    end
  end
end
