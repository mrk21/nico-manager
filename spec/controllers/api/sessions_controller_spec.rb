require 'rails_helper'

RSpec.describe Api::SessionsController, type: :controller do
  describe '#show()' do
    let(:user){ FactoryGirl.create :user }
    
    before do
      session[:user_id] = self.user.id
    end
    
    subject do
      get :show, format: 'json'
    end
    
    it { is_expected.to have_http_status(200) }
  end
  
  describe '#create()' do
    let(:user){ FactoryGirl.create :user }
    
    let(:authorize_stub) do
      allow(User).to receive_messages(authorize: self.user)
    end
    
    subject do
      post :create, format: 'json', auth: {
        mail: 'hoge@foo.com',
        password: 'pass'
      }
    end
    
    before { self.authorize_stub }
    
    it 'should set authorized user id to the session' do
      subject
      expect(session[:user_id]).to eq self.user.id
    end
    
    it { is_expected.to have_http_status(200) }
    
    context 'when authrization failed' do
      let(:authorize_stub) do
        allow(User).to receive_messages(authorize: nil)
      end
      
      it 'should unset the user id from the session' do
        subject
        expect(session[:user_id]).to be_nil
      end
      
      it { is_expected.to have_http_status(400) }
    end
  end
  
  describe '#destroy()' do
    let(:user){ FactoryGirl.create :user }
    
    before do
      session[:user_id] = self.user.id
    end
    
    subject do
      delete :destroy, format: 'json'
    end
    
    it 'should unset the user id from the session' do
      subject
      expect(session[:user_id]).to be_nil
    end
    
    it { is_expected.to have_http_status(200) }
  end
end
