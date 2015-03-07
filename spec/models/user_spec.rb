require 'rails_helper'

RSpec.describe User, type: :model do
  describe '::authorize(mail, password)' do
    let(:session){ FactoryGirl.create :session }
    let(:auth){{mail: 'user_hoge@example.com', password: 'pass'}}
    subject { User.authorize self.auth[:mail], self.auth[:password] }
    
    before do
      allow(Session).to receive_messages(create_by_authorizing: self.session)
    end
    
    it 'should be user' do
      expect(subject.niconico_id).to eq session.user_id
    end
    
    context 'when the user not existed' do
      let(:session){ FactoryGirl.build :session }
      
      it 'should create the user' do
        expect(subject.niconico_id).to eq session.user_id
      end
    end
  end
  
  describe '#fetch_profile()' do
    let(:user){ FactoryGirl.create(:session).user }
    let(:expected_nickname){'hoge'}
    let(:expected_avatar){"http://usericon.nimg.jp/usericon/123/#{self.user.id}.jpg"}
    let(:stub){
      stub_request(:get, 'http://www.nicovideo.jp/my/mylist')
        .with(headers: {
          'Cookie'=> self.user.session.cookie
        })
        .to_return(body: %[
          <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
          <html>
          <head>
          </head>
          <body>
            <div class="userDetail">
              <div class="avatar">
                <a href="http://www.nicovideo.jp/edit_icon">
                  <img src="#{self.expected_avatar}?1111111111" alt="#{self.expected_nickname}" />
                </a>
              </div>
            </div>
          </body>
          </html>
        ])
    }
    
    subject { self.user.fetch_profile }
    before { self.stub }
    
    it 'should set the user nickname' do
      expect(subject.nickname).to eq self.expected_nickname
    end
    
    it 'should set the user avatar' do
      expect(subject.avatar).to eq self.expected_avatar
    end
    
    context 'when this session not existed' do
      let(:user){ FactoryGirl.build :user }
      let(:stub){}
      
      it 'should not do' do
        expect{subject}.not_to raise_error
      end
    end
  end
end
