require 'rails_helper'

RSpec.describe Api::SessionsController, type: :controller do
  describe '#create()' do
    let(:user){ FactoryGirl.create :user }
    define_authenticated_stub { self.user }
    
    subject do
      post :create, format: 'json', auth: {
        mail: 'hoge@foo.com',
        password: 'pass'
      }
    end
    
    before do
      self.authenticated_stub
      subject
    end
    
    it 'should set authenticated user id to the session' do
      expect(session[:user_id]).to eq self.user.id
    end
    
    context 'when authentication failed' do
      define_authenticated_stub {}
      
      it 'should unset the user id from the session' do
        expect(session[:user_id]).to be_nil
      end
    end
  end
  
  describe '#destroy()' do
    let(:user){ FactoryGirl.create :user }
    
    subject { delete :destroy, format: 'json' }
    
    before do
      session[:user_id] = self.user.id
      subject
    end
    
    it 'should unset the user id from the session' do
      expect(session[:user_id]).to be_nil
    end
  end
end
