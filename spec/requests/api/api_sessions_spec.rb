require 'rails_helper'

RSpec.describe "Api::Sessions", type: :request do
  describe 'GET /api/session' do
    authenticated_context do
      it 'should be authenticated user' do
        is_expected.to eq 200
        expect(body).to be_json_eql(current_user.niconico_id.to_json).at_path('niconico_id')
        expect(body).to be_json_eql(current_user.nickname.to_json).at_path('nickname')
        expect(body).to be_json_eql(current_user.avatar.to_json).at_path('avatar')
      end
    end
  end
  
  describe 'POST /api/session' do
    let(:current_user){ FactoryGirl.create(:user) }
    
    define_authenticated_stub { self.current_user }
    
    let(:params){{auth: {
      mail: 'hoge@foo.com',
      password: 'pass'
    }}}
    
    before { self.authenticated_stub }
    
    it 'should be authenticated user' do
      is_expected.to eq 200
      expect(body).to be_json_eql(current_user.niconico_id.to_json).at_path('niconico_id')
      expect(body).to be_json_eql(current_user.nickname.to_json).at_path('nickname')
      expect(body).to be_json_eql(current_user.avatar.to_json).at_path('avatar')
    end
    
    context 'when authentication failed' do
      define_authenticated_stub {}
      
      it 'should be an error response' do
        is_expected.to eq 401
        expect(body).to be_json_eql('Authentication failed'.to_json).at_path('message')
      end
    end
  end
  
  describe 'DELETE /api/session' do
    it 'should be ok response' do
      is_expected.to eq 200
      expect(body).to be_json_eql('Session deleted'.to_json).at_path('message')
    end
  end
end
