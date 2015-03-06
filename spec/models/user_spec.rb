require 'rails_helper'

RSpec.describe User, type: :model do
  describe '#fetch_profile' do
    let(:user){ FactoryGirl.create(:session_of_after_creating_user).user }
    let(:expected_nickname){'hoge'}
    let(:expected_avatar){"http://usericon.nimg.jp/usericon/123/#{self.user.id}.jpg"}
    
    subject { self.user }
    
    before {
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
      
      self.user.fetch_profile
    }
    
    it 'should set the user nickname' do
      expect(subject.nickname).to eq self.expected_nickname
    end
    
    it 'should set the user avatar' do
      expect(subject.avatar).to eq self.expected_avatar
    end
  end
end
